import uuid from 'uuid/v4';

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

    const addColumnEvent = {
      id: uuid(),
      type: 'ADD_COLUMN',
      data: {
        id: uuid(), position: lastPosition, name: name
      }
    };
    return this.stateManager.addEvent(addColumnEvent);
  }

  updateColumn(id, data) {
    const updateColumnEvent = {
      id: uuid(),
      type: 'UPDATE_COLUMN',
      data: {
        columnId: id,
        changes: data
      }
    };
    return this.stateManager.addEvent(updateColumnEvent);
  }
}
