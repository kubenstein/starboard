import { userUpdatedEventType } from 'lib/event-definitions';

export default class UserUpdated {
  forEvent() { return userUpdatedEventType; }

  execute({ stateManager, event }) {
    const { data } = event;
    const existedUser = stateManager.objectData('users', data.id);
    const userData = existedUser || {};

    userData[data.key] = data.value;
    userData.id = data.id;

    if (existedUser) {
      stateManager.updateObject('users', data.id, userData);
    } else {
      stateManager.addObject('users', userData);
    }
  }
}
