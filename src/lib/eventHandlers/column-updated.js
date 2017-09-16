import { columnUpdatedEventType } from '../event-definitions';

export default class ColumnUpdated {
  static forEvent() { return columnUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const { columnId, changes } = event.data;
    const column = this.currentState.objectData('columns', columnId);
    if (!column) return;

    const newPosition = changes.position;

    if (newPosition !== undefined) {
      this.updatePositionOfOtherColumns(column, newPosition);
    }
    this.currentState.updateObject('columns', columnId, changes);
  }

  // private

  updatePositionOfOtherColumns(movedColumn, newPosition) {
    const movedColumnId = movedColumn.id;
    const oldPosition = movedColumn.position;
    const columns = this.currentState.bucket('columns')
                    .filter(c => c.id !== movedColumnId);

    if (newPosition < oldPosition) {
      // moving to left
      // all after movedColumnId's newPosition: update position +1
      columns.forEach((c) => {
        if (c.position >= newPosition && c.position < oldPosition) {
          this.currentState.updateObject('columns', c.id, { position: c.position + 1 });
        }
      });
    } else {
      // moving to right
      // all before movedColumnId's newPosition: update position -1
      columns.forEach((c) => {
        if (c.position <= newPosition && c.position > oldPosition) {
          this.currentState.updateObject('columns', c.id, { position: c.position - 1 });
        }
      });
    }
  }
}
