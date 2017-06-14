/* eslint no-undef: 0 */

const server = require('../components.js').server;
require('./support/steps.js')();

describe('User', () => {
  before(() => { server.start(); });
  after(() => { server.stop(); });
  afterEach(() => { browser.deleteCookie(); });
  beforeEach(() => {
    when.visitingPage();
    userCanSeeLoginPage();
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
