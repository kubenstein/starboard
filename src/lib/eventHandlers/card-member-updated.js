import { cardMemberUpdatedEventType } from 'lib/event-definitions';

export default class CardMemberUpdated {
  forEvent() { return cardMemberUpdatedEventType; }

  execute({ stateManager, event }) {
    const { cardId, userId, set: shouldBeSet } = event.data;
    const card = stateManager.objectData('cards', cardId);
    if (!card) return;

    const memberIds = card.memberIds || [];

    if (shouldBeSet) {
      memberIds.push(userId);
    } else {
      const existedUserIdIndex = memberIds.indexOf(userId);
      if (existedUserIdIndex !== -1) {
        memberIds.splice(existedUserIdIndex, 1);
      }
    }

    stateManager.updateObject('cards', cardId, { memberIds });
  }
}
