const expect = require('chai').expect;
const state = require('../components.js').state;
const e = require('../components.js').eventDefinitions;

describe('Settings Event Handler', () => {
  beforeEach(() => { state.purge(); });

  it('inserts a settings', () => {
    state.addEvent(e.settingsUpdatedEvent(requester(), 'property', 'ok'));

    expect(settingsValueFor('property')).to.eq('ok');
  });

  it('updates existing settings', () => {
    state.addEvent(e.settingsUpdatedEvent(requester(), 'property', 'new'));
    state.addEvent(e.settingsUpdatedEvent(requester(), 'property', 'changed'));

    expect(settingsValueFor('property')).to.eq('changed');
  });

  it('allows to remove settings by passing null value', () => {
    state.addEvent(e.settingsUpdatedEvent(requester(), 'property', 'new'));
    state.addEvent(e.settingsUpdatedEvent(requester(), 'property', null));

    expect(settingsFor('property')).to.be.eq(undefined);
  });

  // private

  function settingsFor(key) {
    return state.objectData('settings', key);
  }

  function settingsValueFor(key) {
    return settingsFor(key).value;
  }

  function requester() {
    return 'dummyRequesterId';
  }
});
