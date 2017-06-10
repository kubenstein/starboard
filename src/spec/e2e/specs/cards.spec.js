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
    currentState.purge();
  });

  it('can be created', () => {
    userCanNotSee('card title');
    following.creatingCard('card title');
    userCanSee('card title');
  });

  it('displays all its labels', () => {
    const labels = {
      hex: ['#00E6FF', '#3CB500'],
      argb: ['rgba(0, 230, 255, 1)', 'rgba(60, 181, 0, 1)']
    };
    utils.createCard('card with labels', { labels: labels.hex }, currentState);

    userCanSeeCardWithLabels('card with labels', labels.argb);
  });
});
