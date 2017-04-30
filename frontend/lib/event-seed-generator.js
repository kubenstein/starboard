/* eslint-disable max-len */

export default class EventSeedGenerator {
  constructor(eventStotage) {
    this.eventStotage = eventStotage;
  }

  generate() {
    const events = [
      { type: 'ADD_COLUMN', data: { id: 'c1', name: 'TODO', position: 1 } },
      { type: 'ADD_CARD', data: { id: 'c1-card1', columnId: 'c1', position: 1, title: 'Task1', description: 'Desc 1' } },
      { type: 'ADD_CARD', data: { id: 'c1-card2', columnId: 'c1', position: 2, title: 'Task2', description: 'Desc 2' } },
      { type: 'ADD_COLUMN', data: { id: 'c2', name: 'DONE', position: 2 } },
      { type: 'ADD_CARD', data: { id: 'c2-card1', columnId: 'c2', position: 1, title: 'Task3', description: 'Desc 3' } },
      { type: 'ADD_COMMENT', data: { id: 'c1-card1-com1', cardId: 'c1-card1', content: 'Comment body', createdAt: (Math.floor(Date.now() / 1000)), author: { name: 'Kuba' } } },
    ];

    events.forEach((event) => {
      this.eventStotage.addEvent(event);
    });
  }
}
