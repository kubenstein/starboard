import { columnAddedEventType } from 'lib/event-definitions';
import repositionAllColumns from './support/reposition-all-columns';

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
