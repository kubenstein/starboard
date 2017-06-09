const expect = require('chai').expect;
module.exports = function() {
  this.whenVisitingMainPage = function() {
    browser.url('/');
  }

  this.whenLogingIn = function(email, password) {
    browser.setValue('input[name=email]', email);
    browser.setValue('input[name=password]', password);
    browser.$('.btn').click();
  }

  this.whenClickingLogout = function() {
    whenOpenSideMenu();
    const logoutButton = browser.$('.btn-logout');
    logoutButton.click();
  }

  this.whenOpenSideMenu = function() {
    const sidemenuTrigger = browser.$('.side-menu-trigger');
    sidemenuTrigger.click();
  }

  this.whenUserSetBoardTitle = function(text) {
    browser.setValue('input.board-name', text);
    browser.keys(["Enter"]);
  }

  this.whenUserSetNickname = function(text) {
    browser.setValue('input.input-nickname', text);
    browser.keys(["Enter"]);
  }

  this.whenUserSetLabels = function(labelsToSet) {
    labelsToSet.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      browser.setValue(cssSelector, labelData.value);
      browser.keys(["Enter"]);
    });
  }

  this.whenUserChangeThemeColor = function(colorInHex) {
    const colorTrigger = browser.$(`.theme-color-picker-input-${colorInHex}`);
    colorTrigger.click();
  }


this.userCanSeeBoardInColor = function(colorInRgba) {
    const board = browser.$('.board');
    const themeColor = browser.elementIdCssProperty(board.element().value.ELEMENT, 'background-color');
    expect(themeColor.value).to.eq(colorInRgba);
  }

  this.userCanSeeLabels = function(setLabels) {
    browser.url('/');
    whenOpenSideMenu();
    setLabels.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      const label = browser.getValue(cssSelector);
      expect(label).to.eq(labelData.value);
    });
  }

  this.userCanSeeNickname = function(text) {
    browser.url('/');
    whenOpenSideMenu();
    const nickname = browser.getValue('input.input-nickname');
    expect(nickname).to.eq(text);
  }

  this.userCanSeeBoardTitle = function(text) {
    browser.url('/');
    const boardName = browser.getValue('input.board-name');
    expect(boardName).to.eq(text);
  }

  this.userCantSeeBoardTitle = function(text) {
    userCanNotSee(text);
  }

  this.userCanSeeLoginPage = function() {
    userCanSee('Login:');
  }

  this.userCanSeeBoard = function() {
    userCanSee('Add a Column...');
  }

  this.userCanSee = function(text) {
    expect($('body').getText()).to.include(text);
  }

  this.userCanNotSee = function(text) {
    expect($('body').getText()).not.to.include(text);
  }
};