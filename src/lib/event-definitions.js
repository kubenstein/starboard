import uuid from 'uuid/v4';
import { currentTimestamp } from './utils.js';

export const noopEventType = 'NOOP';
export function noopEvent() {
  return { type: noopEventType, id: uuid() };
}

export const permissionDeniedEventType = 'PERMISSION_DENIED';
export function permissionDeniedEvent(originalEvent) {
  return {
    type: permissionDeniedEventType,
    originalEvent: originalEvent,
    id: uuid()
  };
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

export const cardLabelUpdatedEventType = 'CARD_LABEL_UPDATED';
export function cardLabelUpdatedEvent(cardId, label, shouldBeSet) {
  return {
    type: cardLabelUpdatedEventType,
    data: {
      cardId: cardId,
      label: label,
      set: shouldBeSet
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

export const columnRemovedEventType = 'COLUMN_REMOVED';
export function columnRemovedEvent(columnId) {
  return {
    type: columnRemovedEventType,
    data: {
      columnId: columnId
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
    authorId
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
      authorId: authorId,
      createdAt: currentTimestamp()
    },
    id: uuid()
  };
}

export const commentUpdatedEventType = 'COMMENT_UPDATED';
export function commentUpdatedEvent(commentId, changes) {
  return {
    type: commentUpdatedEventType,
    data: {
      commentId: commentId,
      changes: changes
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

export const fileRemovedEventType = 'FILE_REMOVED';
export function fileRemovedEvent(filePath) {
  return {
    type: fileRemovedEventType,
    data: {
      filePath: filePath
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

export const userUpdatedEventType = 'USER_UPDATED';
export function userUpdatedEvent(userId, changes) {
  return {
    type: userUpdatedEventType,
    data: {
      id: userId,
      changes: changes
    },
    id: uuid()
  };
}
