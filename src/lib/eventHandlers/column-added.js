import { columnAddedEventType } from 'lib/event-definitions';
import repositionAllColumns from './support/reposition-all-columns';

export default class ColumnAdded {
  forEvent() { return columnAddedEventType; }

  execute({ stateManager, event }) {
    stateManager.addObject('columns', event.data);
    repositionAllColumns(stateManager);
  }
}
