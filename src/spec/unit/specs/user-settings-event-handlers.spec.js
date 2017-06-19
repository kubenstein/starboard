const expect = require('chai').expect;
const currentState = require('../components.js').currentState;
const e = require('../components.js').eventDefinitions;

describe('User settings Event Handler', () => {
  beforeEach(() => { currentState.purge(); });

  it('inserts a user settings', () => {
    currentState.addEvent(e.userUpdatedEvent(userId(), 'nickname', 'newNickname'));

    expect(userSettings().nickname).to.eq('newNickname');
  });

  it('updates existing user settings', () => {
    currentState.addEvent(e.userUpdatedEvent(userId(), 'nickname', 'newNickname'));
    currentState.addEvent(e.userUpdatedEvent(userId(), 'nickname', 'changedNickname'));

    expect(userSettings().nickname).to.eq('changedNickname');
  });

  it('allows to unset settings', () => {
    currentState.addEvent(e.userUpdatedEvent(userId(), 'nickname', 'newNickname'));
    currentState.addEvent(e.userUpdatedEvent(userId(), 'nickname', null));

    expect(userSettings().nickname).to.eq(null);
  });

  // private

  function userId() {
    return 'dummyUserId';
  }

  function userSettings() {
    return currentState.objectData('users', userId());
  }
});
