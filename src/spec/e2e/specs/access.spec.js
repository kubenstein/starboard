const expect = require('chai').expect;
const server = require('../components.js').server;

describe('User', () => {
  before(() => { return server.start(); });
  after(() => { return server.stop(); });
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


  // private

  function whenVisitingMainPage() {
    browser.url('/');
  }

  function whenLogingIn(email, password) {
    browser.setValue('input[name=email]', email);
    browser.setValue('input[name=password]', password);
    browser.$('.btn').click();
  }

  function whenClickingLogout() {
    const sidemenuTrigger = browser.$('.side-menu-trigger');
    sidemenuTrigger.click();
    const logoutButton = browser.$('.btn-logout');
    logoutButton.click();
  }

  function userCanSeeLoginPage() {
    userCanSee('Login:');
  }

  function userCanSeeBoard() {
    userCanSee('Add a Column...');
  }

  function userCanSee(text) {
    expect($('body').getText()).to.include(text);
  }
});
