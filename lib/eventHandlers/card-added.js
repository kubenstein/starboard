export default class CardAdded {
  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    this.currentState.bucket('cards').push(event.data);
  }
}
