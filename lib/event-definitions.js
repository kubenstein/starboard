import uuid from 'uuid/v4';

export function noopEvent() {
  return { id: uuid(), type: 'NOOP-EVENT' };
}

export function cardAddedEvent(params) {
  const { columnId, position, title } = params;
  return {
    id: uuid(),
    type: 'CARD_ADDED',
    data: {
      id: uuid(), columnId: columnId, position: position, title: title, description: ''
    }
  };
}

export function cardUpdatedEvent(cardId, changes) {
  return {
    id: uuid(),
    type: 'CARD_UPDATED',
    data: {
      cardId: cardId,
      changes: changes
    }
  };
}

export function cardRemovedEvent(cardId) {
  return {
    id: uuid(),
    type: 'CARD_REMOVED',
    data: { cardId: cardId }
  };
}

export function columnAddedEvent(params) {
  const { name, position } = params;
  return {
    id: uuid(),
    type: 'COLUMN_ADDED',
    data: {
      id: uuid(), name: name, position: position
    }
  };
}

export function columnUpdatedEvent(columnId, changes) {
  return {
    id: uuid(),
    type: 'COLUMN_UPDATED',
    data: {
      columnId: columnId,
      changes: changes
    }
  };
}

export function commentAddedEvent(cardId, params) {
  const { content } = params;
  return {
    id: uuid(),
    type: 'COMMENT_ADDED',
    data: {
      id: uuid(),
      createdAt: (Math.floor(Date.now() / 1000)),
      cardId: cardId,
      content: content,
      author: { name: 'Kuba' } // TODO: Hardcoded for now
    }
  };
}

export function commentRemovedEvent(commentId) {
  return {
    id: uuid(),
    type: 'COMMENT_REMOVED',
    data: { commentId: commentId }
  };
}
