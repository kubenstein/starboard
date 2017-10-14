/* eslint-disable no-undef */

const expect = require('chai').expect;

module.exports = function steps() {
  this.when = this.and = this.then = this.following = this.again = when = then = this; // eslint-disable-line no-multi-assign

  when.visitingPage = function () {
    browser.url('/');
  };

  when.loggingIn = function (email, password) {
    browser.setValue('input[name=email]', email);
    browser.setValue('input[name=password]', password);
    browser.$('.btn').click();
  };

  when.loggingOut = function () {
    when.openingSideMenu();

    const logoutButton = browser.$('.btn-logout');
    logoutButton.click();
  };

  when.openingSideMenu = function () {
    const selector = '.side-menu-trigger';
    browser.waitForExist(selector, 3000);
    const sidemenuTrigger = browser.$(selector);
    sidemenuTrigger.click();
  };

  when.settingBoardTitle = function (text) {
    const selector = 'input.board-name';
    browser.waitForExist(selector, 3000);
    browser.setValue(selector, text);
    browser.keys(['Enter']);
  };

  when.settingNickname = function (text) {
    browser.setValue('input.input-nickname', text);
    browser.keys(['Enter']);
  };

  when.settingLabels = function (labelsToSet) {
    labelsToSet.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      browser.setValue(cssSelector, labelData.value);
      browser.keys(['Enter']);
    });
  };

  when.changingThemeColor = function (colorInHex) {
    const colorTrigger = browser.$(`.theme-color-picker-input-${colorInHex}`);
    colorTrigger.click();
  };

  when.creatingColumn = function (title) {
    const addColumnPrompt = browser.$('.add-column-form .prompt');
    addColumnPrompt.click();
    browser.setValue('.add-column-form input.column-title', title);
    browser.$('.add-column-form .btn').click();
  };

  when.renamingColumn = function (oldName, newName) {
    userCanSeeColumn(oldName);

    const inputs = browser.$$('.columns input.column-title');
    const input = inputs.filter((i) => { return i.getValue() === oldName; })[0];
    input.setValue(newName);
    browser.keys(['Enter']);
  };

  when.removingColumn = function (columnTitle) {
    userCanSeeColumn(columnTitle);

    const columns = browser.$$('.columns .column');
    const column = columns.filter((c) => { return c.$('input.column-title').getValue() === columnTitle; })[0];
    const removeTrigger = column.$('.btn-remove');
    removeTrigger.click();
    browser.alertAccept();
  };

  when.creatingCard = function (title) {
    const addCardPrompt = browser.$('.add-card-form .prompt');
    addCardPrompt.click();
    browser.setValue('.add-card-form input.card-title', title);
    browser.$('.add-card-form .btn').click();
  };

  when.openingCardDetails = function (cardTitle) {
    userCanSee(cardTitle);

    const cards = browser.$$('.card');
    const card = cards.filter((c) => { return c.$('.title').getText() === cardTitle; })[0];
    card.click();
  };

  when.changingCardTitle = function (newTitle) {
    browser.setValue('.card-details input.title', newTitle);
    browser.keys(['Enter']);
  };

  when.changingCardDescription = function (desc) {
    browser.setValue('.card-details .description-input', desc);

    // clicking elsewhere to submit description
    browser.click('.sub-title');
  };

  when.removingCard = function (optionalCardName) {
    if (optionalCardName) {
      this.openingCardDetails(optionalCardName);
    }

    const selector = '.card-details .btn-remove-card';
    browser.waitForExist(selector, 3000);

    const removeBtn = browser.$(selector);
    removeBtn.click();
    browser.alertAccept();
  };

  when.closingCardDetails = function () {
    const closeBtn = browser.$('.card-details .btn-close');
    closeBtn.click();
  };

  when.openingLabelPicker = function () {
    const labelPicker = browser.$('.card-details .btn-manage-labels');
    labelPicker.click();
  };

  when.togglingLabel = function (labelText) {
    userCanSee(labelText);
    const labelsSelector = '.card-label-picker .label';

    browser.waitForExist(labelsSelector, 3000);
    const labels = browser.$$(labelsSelector);
    const label = labels.filter((l) => { return l.getText() === labelText; })[0];
    label.click();
  };

  when.postingTextComment = function (commentBody) {
    browser.setValue('.add-comment-form .content', commentBody);
    browser.$('.add-comment-form .btn-submit-text').click();
  };

  when.postingAttachmentComment = function (filePath) {
    browser.chooseFile('.add-comment-form .file-input', filePath);
  };

  when.changingUserAvatar = function (filePath) {
    const selector = '.avatar-editor .file-input';
    browser.chooseFile(selector, filePath);
  };

  when.removingUserAvatar = function () {
    browser.$('.avatar-editor .btn-remove').click();
  };

  then.userCanSeeAvatar = function (fileName) {
    browser.waitUntil(() => {
      const avatarEditor = browser.$('.avatar-editor .file-input-trigger');
      const avatarUrl = browser.elementIdCssProperty(avatarEditor.element().value.ELEMENT, 'background-image').value;
      return avatarUrl.indexOf(fileName) !== -1;
    }, 30000, `Expect settings avatar to be set to: ${fileName}`);
  };

  then.userCanSeeActivityLogEntry = function (action, itemTitle) {
    if (action === 'column_created') {
      userCanSee(`added column ${itemTitle}.`);
    }

    if (action === 'card_created') {
      userCanSee(`added card ${itemTitle}.`);
    }

    if (action === 'card_removed') {
      userCanSee(`removed card ${itemTitle} (removed).`);
    }

    if (action === 'column_removed') {
      userCanSee(`removed column ${itemTitle}.`);
    }
  };

  then.userCanSeeBoardInColor = function (colorInRgba) {
    const board = browser.$('.board');
    const themeColor = browser.elementIdCssProperty(board.element().value.ELEMENT, 'background-color');
    expect(themeColor.value).to.eq(colorInRgba);
  };

  then.userCanSeeLabels = function (setLabels) {
    when.visitingPage();
    and.openingSideMenu();
    setLabels.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      const label = browser.getValue(cssSelector);
      expect(label).to.eq(labelData.value);
    });
  };

  then.userCanSeeNickname = function (text) {
    when.visitingPage();
    and.openingSideMenu();
    const nickname = browser.getValue('input.input-nickname');
    expect(nickname).to.eq(text);
  };

  then.userCanSeeBoardTitle = function (text) {
    browser.waitUntil(() => {
      return browser.getValue('input.board-name') === text;
    }, 3000, `Expect board title to be: ${text}`);
  };

  then.userCanNotSeeBoardTitle = function (text) {
    browser.waitUntil(() => {
      return browser.getValue('input.board-name') !== text;
    }, 3000, `Expect board title NOT to be: ${text}`);
  };

  then.userCanSeeLoginPage = function () {
    userCanSee('Login:');
  };

  then.userCanSeeBoard = function () {
    userCanSee('Add a Column...');
  };

  then.userCanSeeColumn = function (columnTitle) {
    browser.waitUntil(() => {
      return browser.$$('input.column-title')
      .map((input) => { return input.getValue(); })
      .indexOf(columnTitle) !== -1;
    }, 3000, `Expect to find a column with a title: ${columnTitle}`);
  };

  then.userCanNotSeeColumn = function (columnTitle) {
    browser.waitUntil(() => {
      return browser.$$('input.column-title')
      .map((input) => { return input.getValue(); })
      .indexOf(columnTitle) === -1;
    }, 3000, `Expect NOT to find a column with a title: ${columnTitle}`);
  };

  then.userCanSeeCardWithLabels = function (cardTitle, labelsInRGB) {
    userCanSee(cardTitle);

    const cards = browser.$$('.card');
    const card = cards.filter((c) => { return c.$('.title').getText() === cardTitle; })[0];

    browser.waitUntil(() => {
      return card.$$('.label').length === labelsInRGB.length;
    }, 3000, `Expect card: ${cardTitle} to have ${labelsInRGB.length} labels`);

    const colors = card.$$('.label').map((label) => {
      return browser.elementIdCssProperty(label.element().value.ELEMENT, 'background-color').value;
    });
    expect(colors).to.eql(labelsInRGB);
  };

  then.userCanSeeDescription = function (text) {
    const selector = '.card-details .description-input';
    browser.waitForExist(selector, 3000);
    expect($(selector).getValue()).to.include(text);
  };

  then.removingComment = function (content) {
    userCanSee(content);

    const comments = browser.$$('.card-comment');
    const comment = comments.filter((c) => { return c.$('.content').getText() === content; })[0];
    comment.$('.btn-remove-comment').click();
    browser.alertAccept();
  };

  then.userCanSeeCommentCounter = function (cardTitle, counter) {
    userCanSee(cardTitle);

    const cards = browser.$$('.card');
    const card = cards.filter((c) => { return c.$('.title').getText() === cardTitle; })[0];
    if (counter > 0) {
      expect(card.getText()).to.include(`☰ ${counter}`);
    } else {
      expect(card.getText()).not.to.include(`☰ ${counter}`);
    }
  };

  then.userCanSeePictureComment = function (imageName) {
    const selector = `.card-details img[src*="${imageName}"]`;
    browser.waitForExist(selector, 3000);

    const img = browser.$(selector);
    userCanSee(imageName); // image description
    expect(img).not.to.eq(undefined);
  };

  then.userCanSeeFileComment = function (fileName) {
    const selector = `.card-details a.attachment[href*="${fileName}"]`;
    browser.waitForExist(selector, 3000);

    const link = browser.$(selector);
    userCanSee(fileName); // file description
    expect(link).not.to.eq(undefined);
  };

  then.userCanSeeCommentAvatar = function (fileName) {
    browser.waitUntil(() => {
      const avatar = browser.$('.card-comment .avatar');
      const avatarUrl = browser.elementIdCssProperty(avatar.element().value.ELEMENT, 'background-image').value;
      return avatarUrl.indexOf(fileName) !== -1;
    }, 30000, `Expect comment avatar to be set to: ${fileName}`);
  };

  then.userCanSee = function (text) {
    browser.waitUntil(() => {
      return browser.getText('body').includes(text);
    }, 3000, `Expect page to have text: ${text}`);
  };

  then.userCanNotSee = function (text) {
    browser.waitUntil(() => {
      return !browser.getText('body').includes(text);
    }, 3000, `Expect page NOT to have text: ${text}`);
  };
};
