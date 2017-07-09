const expect = require('chai').expect;
const currentState = require('../components.js').currentState;
const e = require('../components.js').eventDefinitions;

describe('Column Event Handler', () => {
  beforeEach(() => { currentState.purge(); });

  it('adds a column', () => {
    currentState.addEvent(e.columnAddedEvent(requester(), { name: 'columnName', position: 0 }));

    expect(firstColumn()).to.include({ name: 'columnName', position: 0 });
  });

  it('properly positions second added column', () => {
    currentState.addEvent(e.columnAddedEvent(requester(), { name: 'columnName1', position: 0 }));
    currentState.addEvent(e.columnAddedEvent(requester(), { name: 'columnName2', position: 6 }));

    const columns = existingColumns();
    expect(columns[0]).to.include({ name: 'columnName1', position: 0 });
    expect(columns[1]).to.include({ name: 'columnName2', position: 1 });
  });

  it('removes a column', () => {
    currentState.addEvent(e.columnAddedEvent(requester(), { name: 'columnName', position: 0 }));
    const columnId = firstColumn().id;

    currentState.addEvent(e.columnRemovedEvent(requester(), columnId));
    expect(existingColumns().length).to.eq(0);
  });

  it('removes a column and reposition columns that left', () => {
    currentState.addEvent(e.columnAddedEvent(requester(), { name: 'columnName1', position: 0 }));
    currentState.addEvent(e.columnAddedEvent(requester(), { name: 'columnName2', position: 1 }));
    const columnId = firstColumn().id;

    currentState.addEvent(e.columnRemovedEvent(requester(), columnId));

    expect(firstColumn()).to.include({ name: 'columnName2', position: 0 });
  });

  it('removes all cards within removed column', () => {
    currentState.addEvent(e.columnAddedEvent(requester(), { name: 'columnName', position: 0 }));
    const columnId = firstColumn().id;
    currentState.addEvent(e.cardAddedEvent(requester(), { columnId: columnId, position: 0, title: 'card1' }));
    currentState.addEvent(e.cardAddedEvent(requester(), { columnId: columnId, position: 1, title: 'card2' }));


    expect(existingCards().length).to.eq(2);
    currentState.addEvent(e.columnRemovedEvent(requester(), columnId));
    expect(existingCards().length).to.eq(0);
  });

  it('updates column name', () => {
    currentState.addEvent(e.columnAddedEvent(requester(), { name: 'columnName', position: 0 }));

    const columnId = firstColumn().id;
    currentState.addEvent(e.columnUpdatedEvent(requester(), columnId, { name: 'newColumnName' }));
    expect(firstColumn()).to.include({ name: 'newColumnName' });
  });

  // strange scenarios

  it('handles updating a column that does not exist', () => {
    currentState.addEvent(e.columnUpdatedEvent(requester(), 'InexistentColumnId', { name: 'newColumnName' }));
    expect(existingColumns().length).to.eq(0);
  });

  it('handles removing a column that does not exist', () => {
    currentState.addEvent(e.columnRemovedEvent(requester(), 'InexistentColumnId'));
    expect(existingColumns().length).to.eq(0);
  });

  // private

  function existingColumns() {
    return currentState.bucket('columns');
  }

  function firstColumn() {
    return existingColumns()[0];
  }

  function existingCards() {
    return currentState.bucket('cards');
  }

  function requester() {
    return 'dummyRequesterId';
  }
});
