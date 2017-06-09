const server = require('../components.js').server;
const login = require('./support/utils.js').login;
require('./support/steps.js')();

describe('Board', () => {
  before(() => {
    server.start();
    login('test@test.pl');
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
});
