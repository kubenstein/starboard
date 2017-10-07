import { userUpdatedEvent } from 'lib/event-definitions';

export default class UsersRepository {
  constructor(stateManager, fileUploader) {
    this.stateManager = stateManager;
    this.fileUploader = fileUploader;
  }

  currentUserId() {
    return this.stateManager.getUserId();
  }

  currentUserNickname() {
    const userId = this.currentUserId();
    return this.userNickname(userId);
  }

  currentUserAvatarUrl() {
    const userId = this.currentUserId();
    return this.userAvatarUrl(userId);
  }

  userAvatarUrl(userId) {
    const user = this.stateManager.objectData('users', userId);
    return user && user.avatarUrl;
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

  setCurrentUserAvatar(avatar) {
    const userId = this.currentUserId();
    return this.setUserAvatar(userId, avatar);
  }

  setUserAvatar(userId, avatar) {
    const requesterId = this.currentUserId();

    if (!avatar) {
      const event = userUpdatedEvent(requesterId, userId, 'avatarUrl', null);
      return this.stateManager.addEvent(event);
    }

    return this.fileUploader.uploadFileFromFileBlob(avatar.blob)
    .then((avatarUrl) => {
      const event = userUpdatedEvent(requesterId, userId, 'avatarUrl', avatarUrl);
      return this.stateManager.addEvent(event);
    });
  }
}
