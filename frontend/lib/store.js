import  EventBus from 'lib/event-bus.js'

export default class Store {
  constructor() {
    this.observers = [];
    this.data = [];
    this.eventbus = new EventBus();
    this.eventbus.addObserver(this);
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  update() {
    this.observers.map((observer) => {
      observer.onStoreUpdate(this.data);
    });
  }

  onNewEvent(event) {
    let handlerName = '_' + event.type.toLowerCase() + '_EventHandler';
    if(this[handlerName]) {
      this[handlerName](event);
      this.update();
    }
  }


  // Event Handlers

  _add_column_EventHandler(event) {
    let column = event.data;
    column.cards = [];
    this.data.push(column);
  }

  _add_card_EventHandler(event) {
    let card = event.data;
    card.comments = [];
    let columnId = card.columnId;
    let column = this.data.filter((c) => c.id === columnId)[0];
    column.cards.push(card);
  }

  _add_comment_EventHandler(event) {
    let comment = event.data;
    let cardId = comment.cardId;
    let card = this.data.filter((c) => c.id === cardId)[0];
    card.comments.push(comment);
  }
}