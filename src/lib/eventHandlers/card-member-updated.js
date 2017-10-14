import { cardMemberUpdatedEventType } from 'lib/event-definitions';

export default class CardMemberUpdated {
  forEvent() { return cardMemberUpdatedEventType; }

  execute({ stateManager, event }) {
    const { cardId, userId, set: shouldBeSet } = event.data;
    const card = stateManager.objectData('cards', cardId);
    if (!card) return;

    const userIds = card.memberIds || [];

    if (shouldBeSet) {
      userIds.push(userId);
    } else {
      const existedUserIdIndex = userIds.indexOf(userId);
      if (existedUserIdIndex !== -1) {
        userIds.splice(existedUserIdIndex, 1);
      }
    }

    stateManager.updateObject('cards', cardId, { memberIds: userIds });
  }
}
