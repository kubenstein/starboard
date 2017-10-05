import {
  columnAddedEvent,
  columnUpdatedEvent,
  columnRemovedEvent,
} from 'lib/event-definitions';

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
    const requesterId = this.stateManager.getUserId();
    const lastColumn = this.columnsSortedByPosition().reverse()[0] || { position: -1 };
    const lastPosition = lastColumn.position + 1;

    const event = columnAddedEvent(requesterId, {
      name: name,
      position: lastPosition,
    });
    return this.stateManager.addEvent(event);
  }

  updateColumn(id, changes) {
    const requesterId = this.stateManager.getUserId();
    const event = columnUpdatedEvent(requesterId, id, changes);
    return this.stateManager.addEvent(event);
  }

  removeColumn(id) {
    const requesterId = this.stateManager.getUserId();
    const event = columnRemovedEvent(requesterId, id);
    return this.stateManager.addEvent(event);
  }
}
