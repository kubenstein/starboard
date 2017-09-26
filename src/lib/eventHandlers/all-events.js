import CardsRepository from 'lib/repositories/cards-repository';
import ColumnsRepository from 'lib/repositories/columns-repository';

export default class AllEvents {
  forEvent() { return 'allEventTypes'; }

  execute({ stateManager, event }) {
    this.stateManager = stateManager;
    this.cardsRepo = new CardsRepository(this.stateManager);
    this.columnsRepo = new ColumnsRepository(this.stateManager);
    this.logActivity(event);
  }

  // private

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

  // utils

  storeActivity(activity) {
    this.stateManager.addObject('activities', activity);
  }
}
