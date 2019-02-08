/* eslint-disable no-use-before-define */

import { expect } from 'chai';
import { state, eventDefinitions as e } from '../components';

describe('User settings Event Handler', () => {
  beforeEach(() => state.purge());

  it('inserts a user settings', () => {
    state.addEvent(e.userUpdatedEvent(requester(), userId(), 'nickname', 'newNickname'));

    expect(userSettings().nickname).to.eq('newNickname');
  });

  it('updates existing user settings', () => {
    state.addEvent(e.userUpdatedEvent(requester(), userId(), 'nickname', 'newNickname'));
    state.addEvent(e.userUpdatedEvent(requester(), userId(), 'nickname', 'changedNickname'));

    expect(userSettings().nickname).to.eq('changedNickname');
  });

  it('allows to unset settings', () => {
    state.addEvent(e.userUpdatedEvent(requester(), userId(), 'nickname', 'newNickname'));
    state.addEvent(e.userUpdatedEvent(requester(), userId(), 'nickname', null));

    expect(userSettings().nickname).to.eq(null);
  });

  // private

  function userId() {
    return 'dummyUserId';
  }

  function userSettings() {
    return state.objectData('users', userId());
  }

  function requester() {
    return 'dummyRequesterId';
  }
});
