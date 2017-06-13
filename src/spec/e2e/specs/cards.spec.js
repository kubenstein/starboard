/* eslint no-undef: 0 */

const server = require('../components.js').server;
const currentState = require('../components.js').currentState;
const utils = require('./support/utils.js');
require('./support/steps.js')();

describe('Card', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
    utils.createColumn('column with cards', currentState);
  });

  after(() => {
    utils.logout();
    server.stop();
  });

  it('can be created', () => {
    userCanNotSee('card title');
    following.creatingCard('card title');
    userCanSee('card title');
  });

  it('displays all its labels', () => {
    const labels = {
      hex: ['#00E6FF', '#3CB500'],
      rgba: ['rgba(0, 230, 255, 1)', 'rgba(60, 181, 0, 1)']
    };
    utils.createCard('card with labels', { labels: labels.hex }, currentState);

    userCanSeeCardWithLabels('card with labels', labels.rgba);
  });

  it('displays amount of comments', () => {
    const card = 'card with comment Counter';
    utils.createCard(card, {}, currentState);
    userCanSeeCommentCounter(card, 0);
    utils.addComment(card, 'test@test.pl', 'comment 1', currentState);
    utils.addComment(card, 'test@test.pl', 'comment 2', currentState);
    utils.addComment(card, 'test@test.pl', 'comment 3', currentState);
    userCanSeeCommentCounter(card, 3);
  });

  describe('Details', () => {
    before(() => {
      utils.createCard('card title', {}, currentState);
    });

    afterEach(() => {
      reloading();
    });

    it('allows to change a title', () => {
      utils.createCard('card to rename', {}, currentState);

      following.openingCardDetails('card to rename');
      when.changingCardTitle('changed title');
      and.closingCardDetails();
      userCanSee('changed title');
    });

    it('allows to change a description', () => {
      following.openingCardDetails('card title');
      when.changingCardDescription('new desc');
      and.closingCardDetails();
      and.openingCardDetails('card title');
      userCanSeeDescription('new desc');
    });

    it('allows to remove a card', () => {
      utils.createCard('card to delete', {}, currentState);

      following.openingCardDetails('card to delete');
      and.removingCard();
      userCanNotSee('card to delete');
    });

    it('allows to manage labels of a card', () => {
      utils.createCard('card with labels - details', { labels: ['#00E6FF', '#3CB500'] }, currentState);
      utils.setTextForLabel('#00E6FF', 'blue label', currentState);
      utils.setTextForLabel('#3CB500', 'green label', currentState);
      utils.setTextForLabel('#EB4646', 'red label', currentState);

      following.openingCardDetails('card with labels - details');
      userCanSee('blue label\ngreen label');

      then.when.openingLabelPicker();
      and.togglingLabel('red label');
      and.togglingLabel('blue label');
      userCanSee('green label\nred label');
    });
  });
});
