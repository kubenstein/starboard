const expect = require('chai').expect;
const currentState = require('../components.js').currentState;
const e = require('../components.js').eventDefinitions;

describe('Settings Event Handler', () => {
  beforeEach(() => { currentState.purge(); });

  it('inserts a settings', () => {
    currentState.addEvent(e.settingsUpdatedEvent(requester(), 'property', 'ok'));

    expect(settingsValueFor('property')).to.eq('ok');
  });

  it('updates existing settings', () => {
    currentState.addEvent(e.settingsUpdatedEvent(requester(), 'property', 'new'));
    currentState.addEvent(e.settingsUpdatedEvent(requester(), 'property', 'changed'));

    expect(settingsValueFor('property')).to.eq('changed');
  });

  it('allows to remove settings by passing null value', () => {
    currentState.addEvent(e.settingsUpdatedEvent(requester(), 'property', 'new'));
    currentState.addEvent(e.settingsUpdatedEvent(requester(), 'property', null));

    expect(settingsFor('property')).to.be.eq(undefined);
  });

  // private

  function settingsFor(key) {
    return currentState.objectData('settings', key);
  }

  function settingsValueFor(key) {
    return settingsFor(key).value;
  }

  function requester() {
    return 'dummyRequesterId';
  }
});
