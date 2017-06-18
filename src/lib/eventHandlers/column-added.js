import { columnAddedEventType } from '../event-definitions.js';
import repositionAllColumns from './support/reposition-all-columns.js';

export default class ColumnAdded {
  static forEvent() { return columnAddedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    this.currentState.addObject('columns', event.data);
    repositionAllColumns(this.currentState);
  }
}
