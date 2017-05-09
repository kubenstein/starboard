import {
  columnAddedEvent,
  columnUpdatedEvent,
} from './event-definitions.js';

export default class ColumnsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getColumns() {
    const columns = this.stateManager.bucket('columns');
    return columns.sort((c1, c2) => c1.position - c2.position);
  }

  getColumn(columnId) {
    const columns = this.stateManager.bucket('columns');
    return columns.filter(column => column.id === columnId)[0];
  }

  addColumn(name) {
    const lastColumn = this.getColumns()[0] || { position: 0 };
    const lastPosition = lastColumn.position + 1;

    const event = columnAddedEvent({
      name: name,
      position: lastPosition
    });
    return this.stateManager.addEvent(event);
  }

  updateColumn(id, data) {
    const event = columnUpdatedEvent(id, data);
    return this.stateManager.addEvent(event);
  }
}
