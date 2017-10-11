/* eslint no-undef: 0 */

const server = require('../components.js').server;
const state = require('../components.js').state;
require('./support/steps.js')();

describe('User', () => {
  before(() => { server.start(); });
  after(() => { server.stop(); });
  beforeEach(() => {
    when.visitingPage();
    userCanSeeLoginPage();
  });
  afterEach(() => {
    browser.deleteCookie();
    return state.purge();
  });

  it('can log in', () => {
    when.loggingIn('test@test.pl', 'abcd');
    userCanSeeBoard();
  });

  it('can log out', () => {
    when.loggingIn('test@test.pl', 'abcd');
    and.then.loggingOut();
    userCanSeeLoginPage();
  });
});
