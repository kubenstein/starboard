export default class ColumnUpdated {
  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const columnId = event.data.columnId;
    const changes = event.data.changes;
    const newPosition = changes.position;

    if (newPosition !== undefined) {
      const oldPosition = this.currentState.objectData('columns', columnId).position;
      this.updatePositionOfOtherColumns(columnId, oldPosition, newPosition);
    }

    this.currentState.updateObject('columns', columnId, changes);
  }

  // private

  updatePositionOfOtherColumns(movedColumnId, oldPosition, newPosition) {
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
