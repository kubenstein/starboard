const expect = require('chai').expect;
const currentState = require('../components.js').currentState;
const e = require('../components.js').eventDefinitions;

describe('Cards Event Handler', () => {
  beforeEach(() => {
    return currentState.purge().then(() => {
      return addColumn();
    });
  });

  it('adds a card', () => {
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));

    expect(firstCard()).to.include({ title: 'cardTitle', position: 0 });
  });

  it('properly positions other added cards', () => {
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle1', columnId: columnId(), position: 0 }));
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle2', columnId: columnId(), position: 1 }));
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle3', columnId: columnId(), position: 0 }));

    const cards = existingCards();
    expect(cards[0]).to.include({ title: 'cardTitle1', position: 1 });
    expect(cards[1]).to.include({ title: 'cardTitle2', position: 2 });
    expect(cards[2]).to.include({ title: 'cardTitle3', position: 0 });
  });

  it('removes a card', () => {
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));
    const cardId = firstCard().id;

    currentState.addEvent(e.cardRemovedEvent(requester(), cardId));
    expect(existingCards().length).to.eq(0);
  });

  it('removes a card and reposition cards that left', () => {
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle1', columnId: columnId(), position: 0 }));
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle2', columnId: columnId(), position: 1 }));
    const cardId = firstCard().id;

    currentState.addEvent(e.cardRemovedEvent(requester(), cardId));
    expect(firstCard()).to.include({ title: 'cardTitle2', position: 0 });
  });

  it('removes all card comments', () => {
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));
    const cardId = firstCard().id;
    currentState.addEvent(e.commentAddedEvent(requester(), cardId, { content: 'comment1' }));
    currentState.addEvent(e.commentAddedEvent(requester(), cardId, { content: 'comment2' }));
    currentState.addEvent(e.commentAddedEvent(requester(), cardId, { content: 'comment3' }));
    expect(existingComments().length).to.eq(3);

    currentState.addEvent(e.cardRemovedEvent(requester(), cardId));

    expect(existingComments().length).to.eq(0);
  });

  it('updates card data', () => {
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));
    const cardId = firstCard().id;

    currentState.addEvent(e.cardUpdatedEvent(requester(), cardId, {
      title: 'newCardTitle',
      description: 'newDescription',
    }));

    expect(firstCard()).to.include({ title: 'newCardTitle', description: 'newDescription' });
  });

  it('updates card labels', () => {
    currentState.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));
    const cardId = firstCard().id;

    currentState.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'AAA', true));
    currentState.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'BBB', true));
    currentState.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'CCC', true));

    expect(firstCard().labels).to.eql(['AAA', 'BBB', 'CCC']);

    currentState.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'BBB', false));
    currentState.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'CCC', false));
    currentState.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'DDD', true));

    expect(firstCard().labels).to.eql(['AAA', 'DDD']);
  });

  // strange scenarios

  it('handles adding a card to a column that does not exist', () => {
    currentState.addEvent(e.cardAddedEvent(requester(), {
      title: 'cardTitle',
      columnId: 'InexistentColumnId',
      position: 0,
    }));
    expect(existingCards().length).to.eq(0);
  });

  it('handles updating a card that does not exist', () => {
    currentState.addEvent(e.cardUpdatedEvent(requester(), 'InexistentCardId', { title: 'newCardTitle' }));
    expect(existingCards().length).to.eq(0);
  });

  it('handles updating labels of a card that does not exist', () => {
    currentState.addEvent(e.cardLabelUpdatedEvent(requester(), 'InexistentCardId', 'AAA', true));
    expect(existingCards().length).to.eq(0);
  });


  it('handles removing a card that does not exist', () => {
    currentState.addEvent(e.cardRemovedEvent(requester(), 'InexistentCardId'));
    expect(existingCards().length).to.eq(0);
  });

  // private

  function addColumn() {
    return currentState.addEvent(e.columnAddedEvent(requester(), { name: 'columnName', position: 0 }));
  }

  function columnId() {
    return currentState.bucket('columns')[0].id;
  }

  function existingCards() {
    return currentState.bucket('cards');
  }

  function existingComments() {
    return currentState.bucket('comments');
  }

  function firstCard() {
    return existingCards()[0];
  }

  function requester() {
    return 'dummyRequesterId';
  }
});
