/* eslint no-undef: 0 */
const expect = require('chai').expect;
const currentState = require('../components.js').currentState;
const e = require('../components.js').eventDefinitions;

describe('CurrentState', () => {
  beforeEach(() => {
    currentState.purge();
  });

  it('has initial buckets empty', () => {
    expect(currentState.bucket('dummy1')).to.deep.eq([]);
    expect(currentState.bucket('dummy2')).to.deep.eq([]);
  });

  it('ignores unknown/noop events', () => {
    const unknownEvent = {
      type: 'unknown',
      id: 'unknown'
    };
    expect(currentState.data).to.deep.eq({});
    currentState.addEvent(unknownEvent);
    currentState.addEvent(e.noopEvent());
    expect(currentState.data).to.deep.eq({});
  });
});
