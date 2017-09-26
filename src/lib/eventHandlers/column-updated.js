import { columnUpdatedEventType } from 'lib/event-definitions';

export default class ColumnUpdated {
  forEvent() { return columnUpdatedEventType; }

  execute({ stateManager, event }) {
    this.stateManager = stateManager;

    const { columnId, changes } = event.data;
    const column = this.stateManager.objectData('columns', columnId);
    if (!column) return;

    const newPosition = changes.position;

    if (newPosition !== undefined) {
      this.updatePositionOfOtherColumns(column, newPosition);
    }
    this.stateManager.updateObject('columns', columnId, changes);
  }

  // private

  updatePositionOfOtherColumns(movedColumn, newPosition) {
    const movedColumnId = movedColumn.id;
    const oldPosition = movedColumn.position;
    const columns = this.stateManager.bucket('columns')
                    .filter(c => c.id !== movedColumnId);

    if (newPosition < oldPosition) {
      // moving to left
      // all after movedColumnId's newPosition: update position +1
      columns.forEach((c) => {
        if (c.position >= newPosition && c.position < oldPosition) {
          this.stateManager.updateObject('columns', c.id, { position: c.position + 1 });
        }
      });
    } else {
      // moving to right
      // all before movedColumnId's newPosition: update position -1
      columns.forEach((c) => {
        if (c.position <= newPosition && c.position > oldPosition) {
          this.stateManager.updateObject('columns', c.id, { position: c.position - 1 });
        }
      });
    }
  }
}
