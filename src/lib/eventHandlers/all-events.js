export default class AllEvents {
  static forEvent() { return 'allEventTypes'; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    this.currentState.addObject('activities', event);
  }
}
