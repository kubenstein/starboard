const expect = require('chai').expect;
module.exports = function() {
  this.when = this.and = this.then = when = and = then = this;

  when.visitingMainPage = function() {
    browser.url('/');
  }

  when.logingIn = function(email, password) {
    browser.setValue('input[name=email]', email);
    browser.setValue('input[name=password]', password);
    browser.$('.btn').click();
  }

  when.clickingLogout = function() {
    openingSideMenu();
    const logoutButton = browser.$('.btn-logout');
    logoutButton.click();
  }

  when.openingSideMenu = function() {
    const sidemenuTrigger = browser.$('.side-menu-trigger');
    sidemenuTrigger.click();
  }

  when.settingBoardTitle = function(text) {
    browser.setValue('input.board-name', text);
    browser.keys(["Enter"]);
  }

  when.settingNickname = function(text) {
    browser.setValue('input.input-nickname', text);
    browser.keys(["Enter"]);
  }

  when.settingLabels = function(labelsToSet) {
    labelsToSet.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      browser.setValue(cssSelector, labelData.value);
      browser.keys(["Enter"]);
    });
  }

  when.changingThemeColor = function(colorInHex) {
    const colorTrigger = browser.$(`.theme-color-picker-input-${colorInHex}`);
    colorTrigger.click();
  }

  then.userCanSeeBoardInColor = function(colorInRgba) {
    const board = browser.$('.board');
    const themeColor = browser.elementIdCssProperty(board.element().value.ELEMENT, 'background-color');
    expect(themeColor.value).to.eq(colorInRgba);
  }

  then.userCanSeeLabels = function(setLabels) {
    when.visitingMainPage();
    and.openingSideMenu();
    setLabels.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      const label = browser.getValue(cssSelector);
      expect(label).to.eq(labelData.value);
    });
  }

  then.userCanSeeNickname = function(text) {
    when.visitingMainPage();
    and.openingSideMenu();
    const nickname = browser.getValue('input.input-nickname');
    expect(nickname).to.eq(text);
  }

  then.userCanSeeBoardTitle = function(text) {
    when.visitingMainPage();
    const boardName = browser.getValue('input.board-name');
    expect(boardName).to.eq(text);
  }

  then.userCantSeeBoardTitle = function(text) {
    userCanNotSee(text);
  }

  then.userCanSeeLoginPage = function() {
    userCanSee('Login:');
  }

  then.userCanSeeBoard = function() {
    userCanSee('Add a Column...');
  }

  then.userCanSee = function(text) {
    expect($('body').getText()).to.include(text);
  }

  then.userCanNotSee = function(text) {
    expect($('body').getText()).not.to.include(text);
  }
};