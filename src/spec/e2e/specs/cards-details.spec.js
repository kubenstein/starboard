/* eslint no-undef: 0 */

const server = require('../components.js').server;
const state = require('../components.js').state;
const utils = require('./support/utils.js');
require('./support/steps.js')();

describe('Card Details', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
  });

  after(() => {
    utils.logout();
    server.stop();
  });

  beforeEach(() => {
    visitingPage();
    return utils.createColumn('column with cards - details', state);
  });

  afterEach(() => { return state.purge(); });

  it('allows to change a title', () => {
    utils.createCard('card to rename', {}, state);

    when.openingCardDetails('card to rename');
    and.changingCardTitle('changed title');
    and.closingCardDetails();
    userCanSee('changed title');
  });

  it('allows to change a description', () => {
    utils.createCard('card with description', {}, state);
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
    utils.createCard('card to delete', {}, state);

    when.openingCardDetails('card to delete');
    and.removingCard();
    userCanNotSee('card to delete');
  });

  it('allows to manage labels of a card', () => {
    utils.createCard('card with labels - details', { labels: ['#00E6FF', '#3CB500'] }, state);
    utils.setTextForLabel('#00E6FF', 'blue label', state);
    utils.setTextForLabel('#3CB500', 'green label', state);
    utils.setTextForLabel('#EB4646', 'red label', state);

    following.openingCardDetails('card with labels - details');
    userCanSee('blue label\ngreen label');

    then.when.openingLabelPicker();
    and.togglingLabel('red label');
    and.togglingLabel('blue label');
    userCanSee('green label\nred label');
  });

  it('allows to manage members of a card', () => {
    utils.createCard('card with members - details', {}, state);
    utils.createUser('member1@test.pl', state);
    utils.createUser('member2@test.pl', state);

    following.openingCardDetails('card with members - details');
    userCanNotSeeMember('member1@test.pl');

    then.when.openingMemberPicker();
    and.togglingMember('member1@test.pl');
    userCanSeeMember('member1@test.pl');

    when.togglingMember('member2@test.pl');
    userCanSeeMember('member1@test.pl');
    userCanSeeMember('member2@test.pl');
  });
});
