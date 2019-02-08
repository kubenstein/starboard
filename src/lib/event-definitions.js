import uuid from 'uuid/v4';
import { currentTimestamp } from 'lib/utils';

export const noopEventType = 'NOOP';
export function noopEvent(description = null) {
  const event = {
    type: noopEventType,
    id: uuid(),
  };
  if (description) event.description = description;
  return event;
}

export const permissionDeniedEventType = 'PERMISSION_DENIED';
export function permissionDeniedEvent(originalEvent) {
  return {
    type: permissionDeniedEventType,
    originalEvent,
    id: uuid(),
  };
}

export const cardAddedEventType = 'CARD_ADDED';
export function cardAddedEvent(requesterId, params) {
  const { columnId, position, title } = params;
  return {
    type: cardAddedEventType,
    data: {
      id: uuid(),
      columnId,
      position,
      title,
      description: '',
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const cardUpdatedEventType = 'CARD_UPDATED';
export function cardUpdatedEvent(requesterId, cardId, changes) {
  return {
    type: cardUpdatedEventType,
    data: {
      cardId,
      changes,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const cardLabelUpdatedEventType = 'CARD_LABEL_UPDATED';
export function cardLabelUpdatedEvent(requesterId, cardId, label, shouldBeSet) {
  return {
    type: cardLabelUpdatedEventType,
    data: {
      cardId,
      label,
      set: shouldBeSet,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const cardMemberUpdatedEventType = 'CARD_MEMBER_UPDATED';
export function cardMemberUpdatedEvent(requesterId, cardId, userId, shouldBeSet) {
  return {
    type: cardMemberUpdatedEventType,
    data: {
      cardId,
      userId,
      set: shouldBeSet,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const cardRemovedEventType = 'CARD_REMOVED';
export function cardRemovedEvent(requesterId, cardId) {
  return {
    type: cardRemovedEventType,
    data: { cardId },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const columnAddedEventType = 'COLUMN_ADDED';
export function columnAddedEvent(requesterId, params) {
  const { name, position } = params;
  return {
    type: columnAddedEventType,
    data: {
      id: uuid(),
      name,
      position,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const columnUpdatedEventType = 'COLUMN_UPDATED';
export function columnUpdatedEvent(requesterId, columnId, changes) {
  return {
    type: columnUpdatedEventType,
    data: {
      columnId,
      changes,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const columnRemovedEventType = 'COLUMN_REMOVED';
export function columnRemovedEvent(requesterId, columnId) {
  return {
    type: columnRemovedEventType,
    data: {
      columnId,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const commentAddedEventType = 'COMMENT_ADDED';
export function commentAddedEvent(requesterId, cardId, params) {
  const {
    content,
    attachmentName,
    attachmentSize,
    attachmentType,
    attachmentUrl,
  } = params;

  let attachment = null;
  if (attachmentName) {
    attachment = {
      name: attachmentName,
      size: attachmentSize,
      type: attachmentType,
      dataUrl: attachmentUrl,
    };
  }

  return {
    type: commentAddedEventType,
    data: {
      id: uuid(),
      cardId,
      content,
      attachment,
      authorId: requesterId,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const commentRemovedEventType = 'COMMENT_REMOVED';
export function commentRemovedEvent(requesterId, commentId) {
  return {
    type: commentRemovedEventType,
    data: { commentId },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const fileAddedEventType = 'FILE_ADDED';
export function fileAddedEvent(requesterId, filePath) {
  return {
    type: fileAddedEventType,
    data: {
      filePath,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const fileRemovedEventType = 'FILE_REMOVED';
export function fileRemovedEvent(requesterId, filePath) {
  return {
    type: fileRemovedEventType,
    data: {
      filePath,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const settingsUpdatedEventType = 'SETTINGS_UPDATED';
export function settingsUpdatedEvent(requesterId, key, value) {
  return {
    type: settingsUpdatedEventType,
    data: {
      id: key,
      value,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}

export const userUpdatedEventType = 'USER_UPDATED';
export function userUpdatedEvent(requesterId, userId, key, value) {
  return {
    type: userUpdatedEventType,
    data: {
      id: userId,
      key,
      value,
    },
    createdAt: currentTimestamp(),
    requesterId,
    id: uuid(),
  };
}
