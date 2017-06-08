const expect = require('chai').expect;
const server = require('../components.js').server;

describe('Board', () => {
  before(() => {
    server.start();
    whenVisitingMainPage();
    whenLogingIn('test@test.pl', 'abcd');
  });

  after(() => {
    browser.deleteCookie();
    server.stop();
  });

  it('can have a title', () => {
    userCantSeeBoardTitle('dev board');
    whenUserSetBoardTitle('dev board');
    userCanSeeBoardTitle('dev board');
  });

  it('properly keeps a user id', () => {
    whenOpenSideMenu();
    userCanSee('test@test.pl');
  });

  it('properly keeps a user nickname', () => {
    whenVisitingMainPage();
    whenOpenSideMenu();
    whenUserSetNickname('Kuba');
    userCanSeeNickname('Kuba');
  });

  // private

  function whenUserSetBoardTitle(text) {
    browser.setValue('input.board-name', text);
    browser.keys(["Enter"]);
  }

  function whenOpenSideMenu() {
    const sidemenuTrigger = browser.$('.side-menu-trigger');
    sidemenuTrigger.click();
  }

  function whenUserSetNickname(text) {
    browser.setValue('input.input-nickname', text);
    browser.keys(["Enter"]);
  }

  function userCanSeeNickname(text) {
    browser.url('/');
    whenOpenSideMenu();
    const nickname = browser.getValue('input.input-nickname');
    expect(nickname).to.eq(text);
  }

  function userCanSeeBoardTitle(text) {
    browser.url('/');
    const boardName = browser.getValue('input.board-name');
    expect(boardName).to.eq(text);
  }

  function userCantSeeBoardTitle(text) {
    userCanNotSee(text);
  }

  // utils

  function whenVisitingMainPage() {
    browser.url('/');
  }

  function whenLogingIn(email, password) {
    browser.setValue('input[name=email]', email);
    browser.setValue('input[name=password]', password);
    browser.$('.btn').click();
  }

  function userCanSee(text) {
    expect($('body').getText()).to.include(text);
  }

  function userCanNotSee(text) {
    expect($('body').getText()).to.not.include(text);
  }
});
