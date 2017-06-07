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

  // private

  function userCantSeeBoardTitle(text) {
    userCanNotSee(text);
  }

  function whenUserSetBoardTitle(text) {
    browser.setValue('input.board-name', text);
    browser.keys(["Enter"]);
  }

  function userCanSeeBoardTitle(text) {
    browser.url('/');
    const boardName = browser.getValue('input.board-name');
    expect(boardName).to.eq(text);
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
