const server = require('../components.js').server;
require('./support/steps.js')();

describe('User', () => {
  before(() => { server.start(); });
  after(() => { server.stop(); });
  afterEach(() => { browser.deleteCookie(); });

  it('can log in', () => {
    whenVisitingMainPage();
    userCanSeeLoginPage();
    whenLogingIn('test@test.pl', 'abcd');
    userCanSeeBoard();
  });

  it('can log out', () => {
    whenVisitingMainPage();
    whenLogingIn('test@test.pl', 'abcd');
    whenClickingLogout();
    userCanSeeLoginPage();
  });
});
