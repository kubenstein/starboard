import uuid from 'uuid/v4';
import { currentTimestamp } from 'lib/utils';

export const noopEventType = 'NOOP';
export function noopEvent(description = null) {
  const event = {
    type: noopEventType,
    id: uuid()
  };
  if (description) event.description = description;
  return event;
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
export function cardAddedEvent(requesterId, params) {
  const { columnId, position, title } = params;
  return {
    type: cardAddedEventType,
    data: {
      id: uuid(),
      columnId: columnId,
      position: position,
      title: title,
      description: ''
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const cardUpdatedEventType = 'CARD_UPDATED';
export function cardUpdatedEvent(requesterId, cardId, changes) {
  return {
    type: cardUpdatedEventType,
    data: {
      cardId: cardId,
      changes: changes
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const cardLabelUpdatedEventType = 'CARD_LABEL_UPDATED';
export function cardLabelUpdatedEvent(requesterId, cardId, label, shouldBeSet) {
  return {
    type: cardLabelUpdatedEventType,
    data: {
      cardId: cardId,
      label: label,
      set: shouldBeSet
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const cardRemovedEventType = 'CARD_REMOVED';
export function cardRemovedEvent(requesterId, cardId) {
  return {
    type: cardRemovedEventType,
    data: { cardId: cardId },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const columnAddedEventType = 'COLUMN_ADDED';
export function columnAddedEvent(requesterId, params) {
  const { name, position } = params;
  return {
    type: columnAddedEventType,
    data: {
      id: uuid(),
      name: name,
      position: position
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const columnUpdatedEventType = 'COLUMN_UPDATED';
export function columnUpdatedEvent(requesterId, columnId, changes) {
  return {
    type: columnUpdatedEventType,
    data: {
      columnId: columnId,
      changes: changes
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const columnRemovedEventType = 'COLUMN_REMOVED';
export function columnRemovedEvent(requesterId, columnId) {
  return {
    type: columnRemovedEventType,
    data: {
      columnId: columnId
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const commentAddedEventType = 'COMMENT_ADDED';
export function commentAddedEvent(requesterId, cardId, params) {
  const {
    content,
    attachmentName,
    attachmentSize,
    attachmentType,
    attachmentUrl
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
      authorId: requesterId,
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const commentRemovedEventType = 'COMMENT_REMOVED';
export function commentRemovedEvent(requesterId, commentId) {
  return {
    type: commentRemovedEventType,
    data: { commentId: commentId },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const fileAddedEventType = 'FILE_ADDED';
export function fileAddedEvent(requesterId, filePath) {
  return {
    type: fileAddedEventType,
    data: {
      filePath: filePath
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const fileRemovedEventType = 'FILE_REMOVED';
export function fileRemovedEvent(requesterId, filePath) {
  return {
    type: fileRemovedEventType,
    data: {
      filePath: filePath
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const settingsUpdatedEventType = 'SETTINGS_UPDATED';
export function settingsUpdatedEvent(requesterId, key, value) {
  return {
    type: settingsUpdatedEventType,
    data: {
      id: key,
      value: value
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}

export const userUpdatedEventType = 'USER_UPDATED';
export function userUpdatedEvent(requesterId, userId, key, value) {
  return {
    type: userUpdatedEventType,
    data: {
      id: userId,
      key: key,
      value: value
    },
    createdAt: currentTimestamp(),
    requesterId: requesterId,
    id: uuid()
  };
}
