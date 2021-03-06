/* eslint-disable no-undef, max-len, func-names, prefer-destructuring */

const expect = require('chai').expect;
const avatarZipBase64 = require('./files/zipped/base64ed/').avatar;

module.exports = function steps() {
  this.when = this.and = this.then = this.following = this.again = when = then = this; // eslint-disable-line no-multi-assign

  when.visitingPage = function () {
    browser.url('/');
  };

  when.loggingIn = function (email, password) {
    browser.$('input[name=email]').setValue(email);
    browser.$('input[name=password]').setValue(password);
    browser.$('.btn').click();
  };

  when.loggingOut = function () {
    when.openingSideMenu();

    const logoutButton = browser.$('.btn-logout');
    logoutButton.click();
  };

  when.openingSideMenu = function () {
    const selector = '.side-menu-trigger';
    $(selector).waitForExist(3000);
    const sidemenuTrigger = browser.$(selector);
    sidemenuTrigger.click();
  };

  when.settingBoardTitle = function (text) {
    const selector = 'input.board-name';
    $(selector).waitForExist(3000);
    browser.$(selector).setValue(text);
    browser.keys(['Enter']);
  };

  when.settingNickname = function (text) {
    browser.$('input.input-nickname').setValue(text);
    browser.keys(['Enter']);
  };

  when.settingLabels = function (labelsToSet) {
    labelsToSet.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      browser.$(cssSelector).setValue(labelData.value);
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
    browser.$('.add-column-form input.column-title').setValue(title);
    browser.$('.add-column-form .btn').click();
  };

  when.renamingColumn = function (oldName, newName) {
    userCanSeeColumn(oldName);

    const inputs = browser.$$('.columns input.column-title');

    const input = inputs.filter(i => i.getValue() === oldName)[0];
    input.setValue(newName);
    browser.keys(['Enter']);
  };

  when.removingColumn = function (columnTitle) {
    userCanSeeColumn(columnTitle);

    const columns = browser.$$('.columns .column');
    const column = columns.filter(c => c.$('input.column-title').getValue() === columnTitle)[0];
    const removeTrigger = column.$('.btn-remove');
    removeTrigger.click();
    browser.acceptAlert();
  };

  when.creatingCard = function (title) {
    const addCardPrompt = browser.$('.add-card-form .prompt');
    addCardPrompt.click();
    browser.$('.add-card-form input.card-title').setValue(title);
    browser.$('.add-card-form .btn').click();
  };

  when.openingCardDetails = function (cardTitle) {
    userCanSee(cardTitle);

    const cards = browser.$$('.card');
    const card = cards.filter(c => c.$('.title').getText() === cardTitle)[0];
    card.click();
  };

  when.changingCardTitle = function (newTitle) {
    browser.$('.card-details input.title').setValue(newTitle);
    browser.keys(['Enter']);
  };

  when.changingCardDescription = function (desc) {
    browser.$('.card-details .description-input').setValue(desc);

    // clicking elsewhere to submit description
    $('.sub-title').click();
  };

  when.removingCard = function (optionalCardName) {
    if (optionalCardName) {
      this.openingCardDetails(optionalCardName);
    }

    const removeBtn = $('.card-details .btn-remove-card');
    removeBtn.waitForExist(3000);
    removeBtn.click();
    browser.acceptAlert();
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

    $(labelsSelector).waitForExist(3000);
    const labels = browser.$$(labelsSelector);
    const label = labels.filter(l => l.getText() === labelText)[0];
    label.click();
  };

  when.openingMemberPicker = function () {
    const labelPicker = browser.$('.card-details .btn-manage-members');
    labelPicker.click();
  };

  when.togglingMember = function (memberName) {
    userCanSee(memberName);
    const membersSelector = '.card-member-picker .member';

    $(membersSelector).waitForExist(3000);
    const members = browser.$$(membersSelector);
    const member = members.filter(m => m.getText() === memberName)[0];
    member.click();
  };

  when.postingTextComment = function (commentBody) {
    browser.$('.add-comment-form .content').setValue(commentBody);
    browser.$('.add-comment-form .btn-submit-text').click();
  };

  when.postingAttachmentComment = function (fileZipBase64) {
    const filePath = browser.uploadFile(fileZipBase64);
    $('.add-comment-form .file-input').addValue(filePath);
  };

  when.changingUserAvatar = function () {
    const filePath = browser.uploadFile(avatarZipBase64);

    $('.avatar-editor .file-input').addValue(filePath);
  };

  when.removingUserAvatar = function () {
    browser.$('.avatar-editor .btn-remove').click();
  };

  then.removingComment = function (content) {
    userCanSee(content);

    const comments = browser.$$('.card-comment');
    const comment = comments.filter(c => c.$('.content').getText() === content)[0];
    comment.$('.btn-remove-comment').click();
    browser.acceptAlert();
  };

  then.userCanSeeAvatar = function (fileName) {
    browser.waitUntil(() => {
      const avatarEditor = browser.$('.avatar-editor .file-input-trigger');
      const avatarUrl = avatarEditor.getCSSProperty('background-image').value;
      return avatarUrl.indexOf(fileName) !== -1;
    }, 30000, `Expect settings avatar to be set to: ${fileName}`);
  };

  then.userCanSeeActivityLogEntry = function (action, itemTitle) {
    if (action === 'column_created') {
      userCanSee(`added column ${itemTitle}`);
    }

    if (action === 'card_created') {
      userCanSee(`added card ${itemTitle}`);
    }

    if (action === 'card_removed') {
      userCanSee(`removed card ${itemTitle} (removed)`);
    }

    if (action === 'column_removed') {
      userCanSee(`removed column ${itemTitle}`);
    }
  };

  then.userCanSeeBoardInColor = function (colorInRgba) {
    const board = browser.$('.board');
    const themeColor = board.getCSSProperty('background-color');
    expect(themeColor.value).to.eq(colorInRgba);
  };

  then.userCanSeeLabels = function (setLabels) {
    when.visitingPage();
    and.openingSideMenu();
    setLabels.forEach((labelData) => {
      const cssSelector = `input.label-input-${labelData.color}`;
      const label = $(cssSelector).getValue();
      expect(label).to.eq(labelData.value);
    });
  };

  then.userCanSeeNickname = function (text) {
    when.visitingPage();
    and.openingSideMenu();
    const nickname = $('input.input-nickname').getValue();
    expect(nickname).to.eq(text);
  };

  then.userCanSeeBoardTitle = function (text) {
    browser.waitUntil(
      () => browser.$(`input.board-name[data-value~="${text}"]`),
      3000,
      `Expect board title to be: ${text}`);
  };

  then.userCanNotSeeBoardTitle = function (text) {
    browser.waitUntil(
      () => browser.$(`input.board-name[data-value~="${text}"]`),
      3000,
      `Expect board title NOT to be: ${text}`);
  };

  then.userCanSeeLoginPage = function () {
    userCanSee('Login:');
  };

  then.userCanSeeBoard = function () {
    userCanSee('Add a Column...');
  };

  then.userCanSeeColumn = function (columnTitle) {
    browser.waitUntil(
      () => browser.$(`input.column-title[data-value~="${columnTitle}"]`),
      3000,
      `Expect to find a column with a title: ${columnTitle}`);
  };

  then.userCanNotSeeColumn = function (columnTitle) {
    browser.waitUntil(
      () => browser.$(`input.column-title[data-value~="${columnTitle}"]`),
      3000,
      `Expect NOT to find a column with a title: ${columnTitle}`);
  };

  then.userCanSeeCardWithLabels = function (cardTitle, labelsInRGB) {
    userCanSee(cardTitle);

    const cards = browser.$$('.card');
    const card = cards.filter(c => c.$('.title').getText() === cardTitle)[0];

    browser.waitUntil(
      () => card.$$('.label').length === labelsInRGB.length,
      3000,
      `Expect card: ${cardTitle} to have ${labelsInRGB.length} labels`);

    const colors = card.$$('.label').map(label => label.getCSSProperty('background-color').value);

    expect(colors).to.have.ordered.members(labelsInRGB);
  };

  then.userCanSeeDescription = function (text) {
    const selector = '.card-details .description-input';
    $(selector).waitForExist(3000);
    expect($(selector).getValue()).to.include(text);
  };


  then.userCanSeeCommentCounter = function (cardTitle, counter) {
    userCanSee(cardTitle);

    const cards = browser.$$('.card');
    const card = cards.filter(c => c.$('.title').getText() === cardTitle)[0];
    if (counter > 0) {
      expect(card.getText()).to.include(`☰ ${counter}`);
    } else {
      expect(card.getText()).not.to.include(`☰ ${counter}`);
    }
  };

  then.userCanSeePictureComment = function (imageName) {
    const selector = `.card-details img[src*="${imageName}"]`;
    $(selector).waitForExist(3000);

    const img = browser.$(selector);
    userCanSee(imageName); // image description
    expect(img).not.to.eq(undefined);
  };

  then.userCanSeeFileComment = function (fileName) {
    const selector = `.card-details a.attachment[href*="${fileName}"]`;
    $(selector).waitForExist(3000);

    const link = browser.$(selector);
    userCanSee(fileName); // file description
    expect(link).not.to.eq(undefined);
  };

  then.userCanSeeCommentAvatar = function (fileName) {
    browser.waitUntil(() => {
      const avatar = browser.$('.card-comment .avatar');
      const avatarUrl = avatar.getCSSProperty('background-image').value;
      return avatarUrl.indexOf(fileName) !== -1;
    }, 30000, `Expect comment avatar to be set to: ${fileName}`);
  };

  then.userCanNotSeeMember = function (memberId) {
    const member = $$(`.members-section .member-list div[title="${memberId}"]`)[0];
    expect(member).to.eq(undefined);
  };

  then.userCanSeeMember = function (memberId) {
    const selector = `.members-section .member-list div[title="${memberId}"]`;

    $(selector).waitForExist(3000);
    const member = $$(selector)[0];
    expect(member).not.to.eq(undefined);
  };

  then.userCanSee = function (text) {
    browser.waitUntil(
      () => browser.$('body').getText().includes(text),
      3000,
      `Expect page to have text: ${text}`);
  };

  then.userCanNotSee = function (text) {
    browser.waitUntil(
      () => !browser.$('body').getText().includes(text),
      3000,
      `Expect page NOT to have text: ${text}`);
  };
};
