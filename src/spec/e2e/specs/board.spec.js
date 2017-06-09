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

  it('allows to change user nickname', () => {
    whenVisitingMainPage();
    whenOpenSideMenu();
    whenUserSetNickname('Kuba');
    userCanSeeNickname('Kuba');
  });

  it('allows to change label texts', () => {
    const labelsToSet = [
      { color: '3CB500', value: 'label-green'},
      { color: 'FF9F19', value: 'label-orange'},
      { color: '0079BF', value: 'label-blue'}
    ];
    whenVisitingMainPage();
    whenOpenSideMenu();
    whenUserSetLabels(labelsToSet);
    userCanSeeLabels(labelsToSet);
  });

  it('allows to change theme color', () => {
    const color = {
      hex: '0079BF',
      rgba: 'rgba(0, 121, 191, 1)'
    };
    whenVisitingMainPage();
    whenOpenSideMenu();
    whenUserChangeThemeColor(color.hex);
    userCanSeeBoardInColor(color.rgba);
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

  function whenUserSetLabels(labelsToSet) {
    labelsToSet.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      browser.setValue(cssSelector, labelData.value);
      browser.keys(["Enter"]);
    });
  }

  function whenUserChangeThemeColor(colorInHex) {
    const colorTrigger = browser.$(`.theme-color-picker-input-${colorInHex}`);
    colorTrigger.click();
  }

  function userCanSeeBoardInColor(colorInRgba) {
    const board = browser.$('.board');
    const themeColor = browser.elementIdCssProperty(board.element().value.ELEMENT, 'background-color');
    expect(themeColor.value).to.eq(colorInRgba);
  }

  function userCanSeeLabels(setLabels) {
    browser.url('/');
    whenOpenSideMenu();
    setLabels.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      const label = browser.getValue(cssSelector);
      expect(label).to.eq(labelData.value);
    });
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
