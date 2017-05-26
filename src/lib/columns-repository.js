import {
  columnAddedEvent,
  columnUpdatedEvent,
  columnRemovedEvent
} from './event-definitions.js';

export default class ColumnsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getColumnsSortedByPosition() {
    const columns = this.stateManager.bucket('columns');
    return columns.sort((c1, c2) => c1.position - c2.position);
  }

  getColumn(columnId) {
    const columns = this.stateManager.bucket('columns');
    return columns.filter(column => column.id === columnId)[0];
  }

  addColumn(name) {
    const lastColumn = this.getColumnsSortedByPosition().reverse()[0] || { position: -1 };
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
