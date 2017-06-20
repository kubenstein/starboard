const expect = require('chai').expect;
const currentState = require('../components.js').currentState;
const e = require('../components.js').eventDefinitions;

describe('Comments Event Handler', () => {
  beforeEach(() => {
    return currentState.purge()
    .then(() => { return addColumn(); })
    .then(() => { return addCard(); });
  });

  it('adds a text comment', () => {
    currentState.addEvent(e.commentAddedEvent(cardId(), { content: 'commentContent', authorId: 'authorId' }));

    expect(firstComment()).to.include({ content: 'commentContent', authorId: 'authorId', attachment: null });
  });

  it('adds a comment with an attachment', () => {
    currentState.addEvent(e.commentAddedEvent(cardId(), {
      attachmentName: 'file.zip',
      attachmentSize: 1337,
      attachmentType: 'application/octet-stream',
      attachmentUrl: '/attachments/1234.zip',
      authorId: 'authorId'
    }));

    expect(firstComment().attachment).to.deep.include({
      name: 'file.zip',
      size: 1337,
      type: 'application/octet-stream',
      dataUrl: '/attachments/1234.zip'
    });
  });

  it('removes a comment', () => {
    currentState.addEvent(e.commentAddedEvent(cardId(), { content: 'commentContent', authorId: 'authorId' }));
    const commentId = firstComment().id;

    currentState.addEvent(e.commentRemovedEvent(commentId));
    expect(existingComments().length).to.eq(0);
  });

  // strange scenarios

  it('handles adding a comment to a card that does not exist', () => {
    currentState.addEvent(e.commentAddedEvent('InexistentCommentId', { content: 'commentContent' }));

    expect(existingComments().length).to.eq(0);
  });

  it('handles removing a comment that does not exist', () => {
    currentState.addEvent(e.commentRemovedEvent('InexistentCommentId'));
    expect(existingComments().length).to.eq(0);
  });

  // private

  function addColumn() {
    return currentState.addEvent(e.columnAddedEvent({ name: 'column' }));
  }

  function columnId() {
    return currentState.bucket('columns')[0].id;
  }

  function addCard() {
    return currentState.addEvent(e.cardAddedEvent({ columnId: columnId(), title: 'columnName', position: 0 }));
  }

  function cardId() {
    return currentState.bucket('cards')[0].id;
  }

  function existingComments() {
    return currentState.bucket('comments');
  }

  function firstComment() {
    return existingComments()[0];
  }
});
