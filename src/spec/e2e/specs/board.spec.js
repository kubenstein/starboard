/* eslint no-undef: 0 */

const server = require('../components.js').server;
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

  it('can have a title', () => {
    userCantSeeBoardTitle('dev board');
    when.settingBoardTitle('dev board');
    userCanSeeBoardTitle('dev board');
  });

  it('properly keeps a user id', () => {
    when.openingSideMenu();
    userCanSee('test@test.pl');
  });

  it('allows to change user nickname', () => {
    when.visitingMainPage();
    and.openingSideMenu();
    and.settingNickname('Kuba');
    userCanSeeNickname('Kuba');
  });

  it('allows to change label texts', () => {
    const labelsToSet = [
      { color: '3CB500', value: 'label-green' },
      { color: 'FF9F19', value: 'label-orange' },
      { color: '0079BF', value: 'label-blue' }
    ];
    when.visitingMainPage();
    and.openingSideMenu();
    and.settingLabels(labelsToSet);
    userCanSeeLabels(labelsToSet);
  });

  it('allows to change theme color', () => {
    const color = {
      hex: '0079BF',
      rgba: 'rgba(0, 121, 191, 1)'
    };
    when.visitingMainPage();
    and.openingSideMenu();
    and.changingThemeColor(color.hex);
    userCanSeeBoardInColor(color.rgba);
  });
});
