/* eslint-disable max-len */
const uuid = require('uuid/v4');

class EventSeedGenerator {
  constructor(eventStotage) {
    this.eventStotage = eventStotage;
  }

  generate() {
    const events = [
      { id: uuid(), type: 'ADD_COLUMN', data: { id: 'c1', name: 'TODO', position: 1 } },
      { id: uuid(), type: 'ADD_CARD', data: { id: 'c1-card1', columnId: 'c1', position: 1, title: 'Task1', description: 'Desc 1' } },
      { id: uuid(), type: 'ADD_CARD', data: { id: 'c1-card2', columnId: 'c1', position: 2, title: 'Task2', description: 'Desc 2' } },
      { id: uuid(), type: 'ADD_COLUMN', data: { id: 'c2', name: 'DONE', position: 2 } },
      { id: uuid(), type: 'ADD_CARD', data: { id: 'c2-card1', columnId: 'c2', position: 1, title: 'Task3', description: 'Desc 3' } },
      { id: uuid(), type: 'ADD_COMMENT', data: { id: 'c1-card1-com1', cardId: 'c1-card1', content: 'Comment body', createdAt: (Math.floor(Date.now() / 1000)), author: { name: 'Kuba' } } },
    ];

    let i = 0;
    events.forEach((event) => {
      i = i + 1000;
      setTimeout(() => {
        this.eventStotage.addEvent(event);
      }, i)
    });
  }
}

module.exports = EventSeedGenerator;