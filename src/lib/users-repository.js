import { userUpdatedEvent } from './event-definitions';

export default class UsersRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  currentUserId() {
    return this.stateManager.getUserId();
  }

  currentUserNickname() {
    const userId = this.currentUserId();
    return this.userNickname(userId);
  }

  userNickname(userId) {
    const user = this.stateManager.objectData('users', userId);
    return user && user.nickname;
  }

  setCurrentUserNickname(nickname) {
    const userId = this.currentUserId();
    const requesterId = this.currentUserId();
    const event = userUpdatedEvent(requesterId, userId, 'nickname', nickname);
    return this.stateManager.addEvent(event);
  }

  setUserNickname(userId, nickname) {
    const requesterId = this.currentUserId();
    const event = userUpdatedEvent(requesterId, userId, 'nickname', nickname);
    return this.stateManager.addEvent(event);
  }
}
