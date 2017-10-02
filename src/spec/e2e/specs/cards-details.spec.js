/* eslint no-undef: 0 */

const server = require('../components.js').server;
const currentState = require('../components.js').currentState;
const utils = require('./support/utils.js');
require('./support/steps.js')();

describe('Card Details', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
    return utils.createColumn('column with cards - details', currentState);
  });

  after(() => {
    utils.logout();
    server.stop();
  });

  beforeEach(() => {
    visitingPage();
  });

  it('allows to change a title', () => {
    utils.createCard('card to rename', {}, currentState);

    when.openingCardDetails('card to rename');
    and.changingCardTitle('changed title');
    and.closingCardDetails();
    userCanSee('changed title');
  });

  it('allows to change a description', () => {
    utils.createCard('card with description', {}, currentState);
    visitingPage(); // There is something wonky about this particular spec.
                    // Sometimes whole board is just empty like utils.createCard()
                    // was never triggered (even though it is async, eventually
                    // a card should appear). I added visitingPage() to reload
                    // the whole page - doubt it will truly solve the issue.

    when.openingCardDetails('card with description');
    and.changingCardDescription('new desc');
    and.visitingPage();
    and.again.openingCardDetails('card with description');
    userCanSeeDescription('new desc');
  });

  it('allows to remove a card', () => {
    utils.createCard('card to delete', {}, currentState);

    when.openingCardDetails('card to delete');
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
