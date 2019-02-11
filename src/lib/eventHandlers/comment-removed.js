import { commentRemovedEventType } from 'lib/event-definitions';

export default class CommentRemoved {
  forEvent() { return commentRemovedEventType; }

  execute({ stateManager, event }) {
    const { data: { commentId } } = event;
    stateManager.removeObject('comments', commentId);
  }
}
