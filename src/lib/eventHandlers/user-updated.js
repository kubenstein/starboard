import { userUpdatedEventType } from '../event-definitions.js';

export default class UserUpdated {
  static forEvent() { return userUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const data = event.data;
    const user = this.currentState.objectData('users', data.id);
    if (user) {
      user.nickname = data.changes.nickname;
    } else {
      this.currentState.addObject('users', {
        id: data.id,
        nickname: data.changes.nickname
      });
    }
  }
}
