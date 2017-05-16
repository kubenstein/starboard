export default class CommentAdded {
  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    this.currentState.bucket('comments').push(event.data);
  }
}
