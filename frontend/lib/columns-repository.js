import uuid from 'uuid/v4';

export default class ColumnsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getColumns() {
    const columns = this.stateManager.bucket('columns');
    return columns.sort((c1, c2) => c1.position - c2.position);
  }

  addColumn(name) {
    const lastColumn = this.getColumns()[0] || { position: 0 };
    const lastPosition = lastColumn.position + 1;

    const addColumnEvent = {
      type: 'ADD_COLUMN',
      data: {
        id: uuid(), position: lastPosition, name: name
      }
    };
    return this.stateManager.addEvent(addColumnEvent);
  }
}
