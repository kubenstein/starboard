import uuid from 'uuid/v4';

export function noopEvent() {
  return { type: 'NOOP-EVENT', id: uuid() };
}

export function cardAddedEvent(params) {
  const { columnId, position, title } = params;
  return {
    type: 'CARD_ADDED',
    data: {
      id: uuid(), columnId: columnId, position: position, title: title, description: ''
    },
    id: uuid()
  };
}

export function cardUpdatedEvent(cardId, changes) {
  return {
    type: 'CARD_UPDATED',
    data: {
      cardId: cardId,
      changes: changes
    },
    id: uuid()
  };
}

export function cardRemovedEvent(cardId) {
  return {
    type: 'CARD_REMOVED',
    data: { cardId: cardId },
    id: uuid()
  };
}

export function columnAddedEvent(params) {
  const { name, position } = params;
  return {
    type: 'COLUMN_ADDED',
    data: {
      id: uuid(),
      name: name,
      position: position
    },
    id: uuid()
  };
}

export function columnUpdatedEvent(columnId, changes) {
  return {
    type: 'COLUMN_UPDATED',
    data: {
      columnId: columnId,
      changes: changes
    },
    id: uuid()
  };
}

export function commentAddedEvent(cardId, params) {
  const { content, attachmentName, attachmentSize, attachmentType, attachmentUrl } = params;
  let attachment = null;

  if (attachmentName) {
    attachment = {
      name: attachmentName,
      size: attachmentSize,
      type: attachmentType,
      dataUrl: attachmentUrl
    };
  }

  return {
    type: 'COMMENT_ADDED',
    data: {
      id: uuid(),
      createdAt: (Math.floor(Date.now() / 1000)),
      cardId: cardId,
      content: content,
      attachment: attachment,
      author: { name: 'Kuba' } // TODO: Hardcoded for now
    },
    id: uuid()
  };
}

export function commentRemovedEvent(commentId) {
  return {
    type: 'COMMENT_REMOVED',
    data: { commentId: commentId },
    id: uuid()
  };
}

export function fileAddedEvent(filePath) {
  return {
    type: 'FILE_ADDED',
    data: { filePath: filePath },
    id: uuid()
  };
}
