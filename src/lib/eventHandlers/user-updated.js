import { userUpdatedEventType } from 'lib/event-definitions';

export default class UserUpdated {
  static forEvent() { return userUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const data = event.data;
    const existedUser = this.currentState.objectData('users', data.id);
    const userData = existedUser || {};

    userData[data.key] = data.value;
    userData.id = data.id;

    if (existedUser) {
      this.currentState.updateObject('users', data.id, userData);
    } else {
      this.currentState.addObject('users', userData);
    }
  }
}
