import uuid from 'uuid/v4';

export default class CardsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getCardsForColumn(columnId) {
    const bucket = this.stateManager.bucket('cards');
    return bucket
      .filter(c => c.columnId === columnId)
      .sort((c1, c2) => c1.position - c2.position);
  }

  addCard(title, columnId) {
    const lastCard = this.getCardsForColumn(columnId)[0] || { position: 0 };
    const lastPosition = lastCard.position + 1;

    const addCardEvent = {
      type: 'ADD_CARD',
      data: {
        id: uuid(), columnId: columnId, position: lastPosition, title: title, description: ''
      }
    };
    return this.stateManager.addEvent(addCardEvent);
  }
}
