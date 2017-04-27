export default class EventBus {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
    this.fakeEventsFetching();
  }

  onNewEvent(event) {
    this.notify(event);
  }

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }

  // dummy
  fakeEventsFetching() {
    const dummyEvents = [
      { type: 'ADD_COLUMN', data: { name: 'TODO', id: 1, position: 1 } },
      { type: 'ADD_CARD', data: { columnId: 1, position: 1, id: 1, title: 'Task1', description: 'Desc 1' } },
      { type: 'ADD_CARD', data: { columnId: 1, position: 2, id: 2, title: 'Task2', description: 'Desc 2' } },
      { type: 'ADD_COLUMN', data: { name: 'DONE', id: 2, position: 2 } },
      { type: 'ADD_COMMENT', data: { cardId: 2, id: 3, content: 'Comment body', author: { name: 'Kuba' } } },
      { type: 'ADD_CARD', data: { columnId: 2, position: 1, id: 3, title: 'Task3', description: 'Desc 3' } },
    ];

    dummyEvents.forEach((event) => {
      setTimeout(() => {
        this.onNewEvent(event);
      }, 1000);
    });
  }
}
