export default class ColumnAdded {
  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    this.currentState.bucket('columns').push(event.data);
  }
}
