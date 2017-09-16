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
    const { title } = event.data;
    const activity = event;
    activity.meta = { cardTitle: title };
    this.storeActivity(activity);
  }

  CARDREMOVEDActivityHandler(event) {
    const { cardId } = event.data;
    const card = this.cardsRepo.get(cardId);
    if (!card) return;

    const activity = event;
    activity.meta = { cardTitle: card.title };
    this.storeActivity(activity);
  }

  CARDLABELUPDATEDActivityHandler(event) {
    const { cardId } = event.data;
    const card = this.cardsRepo.get(cardId);
    if (!card) return;

    const activity = event;
    activity.meta = { cardTitle: card.title };
    this.storeActivity(activity);
  }

  COMMENTADDEDActivityHandler(event) {
    const { cardId } = event.data;
    const card = this.cardsRepo.get(cardId);
    if (!card) return;

    const activity = event;
    activity.meta = { cardTitle: card.title };
    this.storeActivity(activity);
  }

  COLUMNADDEDActivityHandler(event) {
    const { name } = event.data;
    const activity = event;
    activity.meta = { columnName: name };
    this.storeActivity(activity);
  }

  COLUMNREMOVEDActivityHandler(event) {
    const { columnId } = event.data;
    const column = this.columnsRepo.get(columnId);
    if (!column) return;

    const activity = event;
    activity.meta = { columnName: column.name };
    this.storeActivity(activity);
  }

  // private

  storeActivity(activity) {
    this.currentState.addObject('activities', activity);
  }
}
