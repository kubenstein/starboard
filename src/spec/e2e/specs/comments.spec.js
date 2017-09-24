/* eslint no-undef: 0 */

const path = require('path');
const server = require('../components.js').server;
const currentState = require('../components.js').currentState;
const utils = require('./support/utils.js');
require('./support/steps.js')();

describe('Comment', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
    return Promise.resolve()
    .then(() => { return utils.createColumn('column', currentState); })
    .then(() => { return utils.createCard('details', {}, currentState); });
  });

  after(() => {
    utils.logout();
    server.stop();
  });

  beforeEach(() => {
    when.visitingPage();
    and.openingCardDetails('details');
  });

  it('can be added with an image attachment', () => {
    const file = path.join(__dirname, 'support', 'files', 'image.jpg');

    following.postingAttachmentComment(file);
    userCanSeePictureComment('image.jpg');
  });

  it('can be added with a file attachment', () => {
    const file = path.join(__dirname, 'support', 'files', 'file.zip');

    following.postingAttachmentComment(file);
    userCanSeeFileComment('file.zip');
  });

  it('can be added with a text content', () => {
    following.postingTextComment('comment body');
    userCanSee('comment body');
  });

  it('is displayed with a user email/nickname/avatar', () => {
    //
    // upload avatar, this should be moved to utils
    const avatar = path.join(__dirname, 'support', 'files', 'avatar.jpg');
    when.visitingPage();
    and.openingSideMenu();
    and.changingUserAvatar(avatar);
    userCanSeeAvatar('avatar.jpg');
    and.visitingPage();
    and.openingCardDetails('details');
    // ---

    following.postingTextComment('comment body');

    userCanSee('comment body');
    and.userCanSee('test@test.pl');

    utils.setNickname('test@test.pl', 'Jakub Niewczas Nickname', currentState);
    userCanSee('Jakub Niewczas Nickname');

    userCanSeeCommentAvatar('avatar.jpg');
  });

  it('can be removed', () => {
    const content = 'comment to remove';

    following.postingTextComment(content);
    userCanSee(content);
    then.when.removingComment(content);
    userCanNotSee(content);
  });
});
