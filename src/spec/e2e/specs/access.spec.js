const server = require('../components.js').server;
require('./support/steps.js')();

describe('User', () => {
  before(() => { server.start(); });
  after(() => { server.stop(); });
  afterEach(() => { browser.deleteCookie(); });

  it('can log in', () => {
    when.visitingMainPage();
    userCanSeeLoginPage();
    when.logingIn('test@test.pl', 'abcd');
    userCanSeeBoard();
  });

  it('can log out', () => {
    when.visitingMainPage();
    and.logingIn('test@test.pl', 'abcd');
    and.clickingLogout();
    userCanSeeLoginPage();
  });
});
