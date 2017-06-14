/* eslint no-undef: 0 */

const server = require('../components.js').server;
const currentState = require('../components.js').currentState;
const utils = require('./support/utils.js');
require('./support/steps.js')();

describe('Card', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
    return utils.createColumn('column with cards', currentState);
  });

  after(() => {
    utils.logout();
    server.stop();
  });

  beforeEach(() => {
    visitingPage();
  });

  it('can be created', () => {
    userCanNotSee('created card');
    following.creatingCard('created card');
    userCanSee('created card');
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
});
