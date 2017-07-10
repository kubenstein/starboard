import CardsRepository from 'lib/cards-repository.js';
import ColumnsRepository from 'lib/columns-repository.js';

export default class AllEvents {
  static forEvent() { return 'allEventTypes'; }

  constructor(currentState) {
    this.currentState = currentState;
    this.cardsRepo = new CardsRepository(this.currentState);
    this.columnsRepo = new ColumnsRepository(this.currentState);
  }

  execute(event) {
    this.logActivity(event);
  }

  logActivity(event) {
    const type = event.type.replace(/_/g, '');
    const handler = this[`${type}ActivityHandler`];
    return handler && handler.bind(this)(event);
  }

  // log event handlers

  CARDADDEDActivityHandler(event) {
    const title = event.data.title;
    const activity = event;
    activity.meta = { cardTitle: title };
    this.storeActivity(activity);
  }

  CARDREMOVEDActivityHandler(event) {
    const cardId = event.data.cardId;
    const activity = event;
    activity.meta = { cardTitle: this.cardsRepo.get(cardId).title };
    this.storeActivity(activity);
  }

  CARDLABELUPDATEDActivityHandler(event) {
    const cardId = event.data.cardId;
    const activity = event;
    activity.meta = { cardTitle: this.cardsRepo.get(cardId).title };
    this.storeActivity(activity);
  }

  COMMENTADDEDActivityHandler(event) {
    const cardId = event.data.cardId;
    const activity = event;
    activity.meta = { cardTitle: this.cardsRepo.get(cardId).title };
    this.storeActivity(activity);
  }

  COLUMNADDEDActivityHandler(event) {
    const name = event.data.name;
    const activity = event;
    activity.meta = { columnName: name };
    this.storeActivity(activity);
  }

  COLUMNREMOVEDActivityHandler(event) {
    const columnId = event.data.columnId;
    const activity = event;
    activity.meta = { columnName: this.columnsRepo.get(columnId).name };
    this.storeActivity(activity);
  }

  // private

  storeActivity(activity) {
    this.currentState.addObject('activities', activity);
  }
}
