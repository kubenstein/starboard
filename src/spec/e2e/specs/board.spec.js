/* eslint no-undef: 0 */

const path = require('path');
const server = require('../components.js').server;
const state = require('../components.js').state;
const utils = require('./support/utils.js');
require('./support/steps.js')();

describe('Board', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
  });

  after(() => {
    utils.logout();
    server.stop();
  });

  beforeEach(() => { when.visitingPage(); });
  afterEach(() => { return state.purge(); });

  it('has a changeable title', () => {
    userCanNotSeeBoardTitle('dev board');
    then.when.settingBoardTitle('dev board');
    userCanSeeBoardTitle('dev board');
  });

  it('properly keeps a user id', () => {
    when.openingSideMenu();
    userCanSee('test@test.pl');
  });

  it('allows to change user nickname', () => {
    when.openingSideMenu();
    and.settingNickname('Kuba');
    userCanSeeNickname('Kuba');
  });

  it('allows to change label texts', () => {
    const labelsToSet = [
      { color: '3CB500', value: 'label-green' },
      { color: 'FF9F19', value: 'label-orange' },
      { color: '0079BF', value: 'label-blue' },
    ];
    when.openingSideMenu();
    and.settingLabels(labelsToSet);
    userCanSeeLabels(labelsToSet);
  });

  it('allows to change theme color', () => {
    const color = {
      hex: '0079BF',
      rgba: 'rgba(0, 121, 191, 1)',
    };
    when.openingSideMenu();
    and.changingThemeColor(color.hex);
    userCanSeeBoardInColor(color.rgba);
  });

  it('tracks changes as an activity log', () => {
    when.openingSideMenu();
    when.creatingColumn('column activity');
    userCanSeeActivityLogEntry('column_created', 'column activity');

    when.creatingCard('activity card');
    userCanSeeActivityLogEntry('card_created', 'activity card');

    when.removingColumn('column activity');
    userCanSeeActivityLogEntry('column_removed', 'column activity');
  });

  it('allows to change user avatar', () => {
    const avatar = path.join(__dirname, 'support', 'files', 'avatar.jpg');

    when.openingSideMenu();
    userCanSeeAvatar('avatar-placeholder.jpg');

    when.changingUserAvatar(avatar);
    userCanSeeAvatar('avatar.jpg');

    and.then.when.removingUserAvatar();
    userCanSeeAvatar('avatar-placeholder.jpg');
  });
});
