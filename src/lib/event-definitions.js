import uuid from 'uuid/v4';
import { currentTimestamp } from './utils.js';

export const noopEventType = 'NOOP_EVENT';
export function noopEvent() {
  return { type: noopEventType, id: uuid() };
}

export const cardAddedEventType = 'CARD_ADDED';
export function cardAddedEvent(params) {
  const { columnId, position, title } = params;
  return {
    type: cardAddedEventType,
    data: {
      id: uuid(),
      columnId: columnId,
      position: position,
      title: title,
      description: '',
      createdAt: currentTimestamp()
    },
    id: uuid()
  };
}

export const cardUpdatedEventType = 'CARD_UPDATED';
export function cardUpdatedEvent(cardId, changes) {
  return {
    type: cardUpdatedEventType,
    data: {
      cardId: cardId,
      changes: changes
    },
    id: uuid()
  };
}

export const cardRemovedEventType = 'CARD_REMOVED';
export function cardRemovedEvent(cardId) {
  return {
    type: cardRemovedEventType,
    data: { cardId: cardId },
    id: uuid()
  };
}

export const columnAddedEventType = 'COLUMN_ADDED';
export function columnAddedEvent(params) {
  const { name, position } = params;
  return {
    type: columnAddedEventType,
    data: {
      id: uuid(),
      name: name,
      position: position,
      createdAt: currentTimestamp()
    },
    id: uuid()
  };
}

export const columnUpdatedEventType = 'COLUMN_UPDATED';
export function columnUpdatedEvent(columnId, changes) {
  return {
    type: columnUpdatedEventType,
    data: {
      columnId: columnId,
      changes: changes
    },
    id: uuid()
  };
}

export const commentAddedEventType = 'COMMENT_ADDED';
export function commentAddedEvent(cardId, params) {
  const {
    content,
    attachmentName,
    attachmentSize,
    attachmentType,
    attachmentUrl,
    authorName,
    authorEmail
  } = params;

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
    type: commentAddedEventType,
    data: {
      id: uuid(),
      cardId: cardId,
      content: content,
      attachment: attachment,
      author: {
        name: authorName,
        email: authorEmail
      },
      createdAt: currentTimestamp()
    },
    id: uuid()
  };
}

export const commentRemovedEventType = 'COMMENT_REMOVED';
export function commentRemovedEvent(commentId) {
  return {
    type: commentRemovedEventType,
    data: { commentId: commentId },
    id: uuid()
  };
}

export const fileAddedEventType = 'FILE_ADDED';
export function fileAddedEvent(filePath) {
  return {
    type: fileAddedEventType,
    data: {
      filePath: filePath,
      createdAt: currentTimestamp()
    },
    id: uuid()
  };
}

export const settingsUpdatedEventType = 'SETTINGS_UPDATED';
export function settingsUpdatedEvent(key, value) {
  return {
    type: settingsUpdatedEventType,
    data: {
      id: key,
      value: value
    },
    id: uuid()
  };
}
