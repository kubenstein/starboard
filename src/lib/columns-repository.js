import {
  columnAddedEvent,
  columnUpdatedEvent,
  columnRemovedEvent
} from './event-definitions.js';

export default class ColumnsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  get(columnId) {
    const columns = this.stateManager.bucket('columns');
    return columns.filter(column => column.id === columnId)[0];
  }

  columnsSortedByPosition() {
    const columns = this.stateManager.bucket('columns');
    return columns.sort((c1, c2) => c1.position - c2.position);
  }

  addColumn(name) {
    const lastColumn = this.columnsSortedByPosition().reverse()[0] || { position: -1 };
    const lastPosition = lastColumn.position + 1;

    const event = columnAddedEvent({
      name: name,
      position: lastPosition
    });
    return this.stateManager.addEvent(event);
  }

  updateColumn(id, changes) {
    const event = columnUpdatedEvent(id, changes);
    return this.stateManager.addEvent(event);
  }

  removeColumn(id) {
    const event = columnRemovedEvent(id);
    return this.stateManager.addEvent(event);
  }
}
