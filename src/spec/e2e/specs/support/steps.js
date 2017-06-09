const expect = require('chai').expect;
module.exports = function() {
  this.when = this.and = this.then = this.following = when = and = then = following = this;

  when.visitingMainPage = function() {
    browser.url('/');
  }

  when.reload = function() {
    visitingMainPage();
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

  when.creatingColumn = function(title) {
    const addColumnPrompt = browser.$('.add-column-form .prompt');
    addColumnPrompt.click();
    browser.setValue('.add-column-form input.column-title', title);
    browser.$('.add-column-form .btn').click();
  }

  when.renamingColumn = function(oldName, newName) {
    const inputs = browser.$$('.columns input.column-title');
    inputs.forEach((input) => {
      if (input.getValue() === oldName) {
        input.setValue(newName);
        browser.keys(["Enter"]);
      }
    });
  }

  when.removingColumn = function(name) {
    const columns = browser.$$('.columns');
    columns.forEach((column) => {
      if (column.$('input.column-title').getValue() === name) {
        const removeTrigger = column.$('.btn-remove');
        removeTrigger.click();
        browser.alertAccept();
      }
    });
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

  then.userCanSeeColumn = function(title) {
    const columnName = browser.getValue('input.column-title');
    expect(columnName).to.eq(title);
  }

  then.userCanNotSeeColumn = function(title) {
    const columns = browser.$$('.columns .column');
    if (columns.length === 0) return;

    const columnName = browser.getValue('input.column-title');
    expect(columnName).not.to.eq(title);
  }

  then.userCanSee = function(text) {
    expect($('body').getText()).to.include(text);
  }

  then.userCanNotSee = function(text) {
    expect($('body').getText()).not.to.include(text);
  }
};