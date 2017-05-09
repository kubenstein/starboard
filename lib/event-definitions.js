import uuid from 'uuid/v4';

export function noopEvent() {
  return { id: uuid(), type: 'noop-commit' };
}

export function addCardEvent(params) {
  const { columnId, position, title } = params;
  return {
    id: uuid(),
    type: 'ADD_CARD',
    data: {
      id: uuid(), columnId: columnId, position: position, title: title, description: ''
    }
  };
}

export function updateCardEvent(cardId, changes) {
  return {
    id: uuid(),
    type: 'UPDATE_CARD',
    data: {
      cardId: cardId,
      changes: changes
    }
  };
}

export function removeCardEvent(cardId) {
  return {
    id: uuid(),
    type: 'REMOVE_CARD',
    data: { cardId: cardId }
  };
}

export function addColumnEvent(params) {
  const { name, position } = params;
  return {
    id: uuid(),
    type: 'ADD_COLUMN',
    data: {
      id: uuid(), name: name, position: position
    }
  };
}

export function updateColumnEvent(columnId, changes) {
  return {
    id: uuid(),
    type: 'UPDATE_COLUMN',
    data: {
      columnId: columnId,
      changes: changes
    }
  };
}

export function addCommentEvent(cardId, params) {
  const { content } = params;
  return {
    id: uuid(),
    type: 'ADD_COMMENT',
    data: {
      id: uuid(),
      createdAt: (Math.floor(Date.now() / 1000)),
      cardId: cardId,
      content: content,
      author: { name: 'Kuba' } // TODO: Hardcoded for now
    }
  };
}

export function removeCommentEvent(commentId) {
  return {
    id: uuid(),
    type: 'REMOVE_COMMENT',
    data: { commentId: commentId }
  };
}
