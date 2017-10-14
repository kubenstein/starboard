const expect = require('chai').expect;
const state = require('../components.js').state;
const e = require('../components.js').eventDefinitions;

describe('Cards Event Handler', () => {
  beforeEach(() => {
    return state.purge().then(() => {
      return addColumn();
    });
  });

  it('adds a card', () => {
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));

    expect(firstCard()).to.include({ title: 'cardTitle', position: 0 });
  });

  it('properly positions other added cards', () => {
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle1', columnId: columnId(), position: 0 }));
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle2', columnId: columnId(), position: 1 }));
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle3', columnId: columnId(), position: 0 }));

    const cards = existingCards();
    expect(cards[0]).to.include({ title: 'cardTitle1', position: 1 });
    expect(cards[1]).to.include({ title: 'cardTitle2', position: 2 });
    expect(cards[2]).to.include({ title: 'cardTitle3', position: 0 });
  });

  it('removes a card', () => {
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));
    const cardId = firstCard().id;

    state.addEvent(e.cardRemovedEvent(requester(), cardId));
    expect(existingCards().length).to.eq(0);
  });

  it('removes a card and reposition cards that left', () => {
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle1', columnId: columnId(), position: 0 }));
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle2', columnId: columnId(), position: 1 }));
    const cardId = firstCard().id;

    state.addEvent(e.cardRemovedEvent(requester(), cardId));
    expect(firstCard()).to.include({ title: 'cardTitle2', position: 0 });
  });

  it('removes all card comments', () => {
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));
    const cardId = firstCard().id;
    state.addEvent(e.commentAddedEvent(requester(), cardId, { content: 'comment1' }));
    state.addEvent(e.commentAddedEvent(requester(), cardId, { content: 'comment2' }));
    state.addEvent(e.commentAddedEvent(requester(), cardId, { content: 'comment3' }));
    expect(existingComments().length).to.eq(3);

    state.addEvent(e.cardRemovedEvent(requester(), cardId));

    expect(existingComments().length).to.eq(0);
  });

  it('updates card data', () => {
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));
    const cardId = firstCard().id;

    state.addEvent(e.cardUpdatedEvent(requester(), cardId, {
      title: 'newCardTitle',
      description: 'newDescription',
    }));

    expect(firstCard()).to.include({ title: 'newCardTitle', description: 'newDescription' });
  });

  it('updates card labels', () => {
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));
    const cardId = firstCard().id;

    state.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'AAA', true));
    state.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'BBB', true));
    state.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'CCC', true));

    expect(firstCard().labels).to.eql(['AAA', 'BBB', 'CCC']);

    state.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'BBB', false));
    state.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'CCC', false));
    state.addEvent(e.cardLabelUpdatedEvent(requester(), cardId, 'DDD', true));

    expect(firstCard().labels).to.eql(['AAA', 'DDD']);
  });

  it('updates card members', () => {
    state.addEvent(e.cardAddedEvent(requester(), { title: 'cardTitle', columnId: columnId(), position: 0 }));
    const cardId = firstCard().id;

    state.addEvent(e.cardMemberUpdatedEvent(requester(), cardId, 'memberId1', true));
    state.addEvent(e.cardMemberUpdatedEvent(requester(), cardId, 'memberId2', true));

    expect(firstCard().memberIds).to.eql(['memberId1', 'memberId2']);

    state.addEvent(e.cardMemberUpdatedEvent(requester(), cardId, 'memberId1', false));

    expect(firstCard().memberIds).to.eql(['memberId2']);
  });

  // strange scenarios

  it('handles adding a card to a column that does not exist', () => {
    state.addEvent(e.cardAddedEvent(requester(), {
      title: 'cardTitle',
      columnId: 'InexistentColumnId',
      position: 0,
    }));
    expect(existingCards().length).to.eq(0);
  });

  it('handles updating a card that does not exist', () => {
    state.addEvent(e.cardUpdatedEvent(requester(), 'InexistentCardId', { title: 'newCardTitle' }));
    expect(existingCards().length).to.eq(0);
  });

  it('handles updating labels of a card that does not exist', () => {
    state.addEvent(e.cardLabelUpdatedEvent(requester(), 'InexistentCardId', 'AAA', true));
    expect(existingCards().length).to.eq(0);
  });


  it('handles removing a card that does not exist', () => {
    state.addEvent(e.cardRemovedEvent(requester(), 'InexistentCardId'));
    expect(existingCards().length).to.eq(0);
  });

  // private

  function addColumn() {
    return state.addEvent(e.columnAddedEvent(requester(), { name: 'columnName', position: 0 }));
  }

  function columnId() {
    return state.bucket('columns')[0].id;
  }

  function existingCards() {
    return state.bucket('cards');
  }

  function existingComments() {
    return state.bucket('comments');
  }

  function firstCard() {
    return existingCards()[0];
  }

  function requester() {
    return 'dummyRequesterId';
  }
});
