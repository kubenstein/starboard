import { commentRemovedEventType } from 'lib/event-definitions';

export default class CommentRemoved {
  forEvent() { return commentRemovedEventType; }

  execute({ stateManager, event }) {
    const { commentId } = event.data;
    stateManager.removeObject('comments', commentId);
  }
}
