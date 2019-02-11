import State from 'lib/state';
import { settingsUpdatedEventType } from 'lib/event-definitions';

export default class FrontendAppState extends State {
  constructor(params) {
    const { dataEventStorage, userId, appEventStorage } = params;
    super({ eventStorage: dataEventStorage, userId });

    this.appEventStorage = appEventStorage;
    this.appEventStorage.addObserver(this);
  }

  addEvent(event) {
    if (this.interceptEvent(event)) {
      return this.appEventStorage.addEvent(event);
    }
    return this.eventStorage.addEvent(event);
  }

  // private

  interceptEvent(event) {
    const { type, requesterId } = event;
    return (type === settingsUpdatedEventType && requesterId === 'StarboardFrontEndApp');
  }
}
