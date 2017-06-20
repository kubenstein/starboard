const expect = require('chai').expect;
const currentState = require('../components.js').currentState;
const e = require('../components.js').eventDefinitions;

describe('CurrentState', () => {
  beforeEach(() => { currentState.purge(); });

  it('has initial buckets empty', () => {
    expect(currentState.bucket('dummy1')).to.eql([]);
    expect(currentState.bucket('dummy2')).to.eql([]);
  });

  it('ignores unknown/noop events', () => {
    const unknownEvent = {
      type: 'unknown',
      id: 'unknown'
    };
    expect(currentState.data).to.eql({});
    currentState.addEvent(unknownEvent);
    currentState.addEvent(e.noopEvent());
    expect(currentState.data).to.eql({});
  });

  it('proviedes convinient way of finding data', () => {
    const obj = { id: 1, param: 'value' };
    currentState.addObject('bucket', obj);

    expect(currentState.objectData('bucket', 1)).to.eq(obj);
  });

  it('proviedes convinient way of adding data to a bucket', () => {
    const obj = { id: 1, param: 'value' };
    currentState.addObject('bucket', obj);

    expect(currentState.bucket('bucket')).to.eql([obj]);
  });

  it('proviedes convinient way of updating data', () => {
    const obj1 = { id: 1, param: 'value1' };
    const obj2 = { id: 2, param: 'value2' };
    currentState.addObject('bucket', obj1);
    currentState.addObject('bucket', obj2);

    currentState.updateObject('bucket', 1, { param: 'new' });

    expect(currentState.bucket('bucket')[0]).to.eql({ id: 1, param: 'new' });
    expect(currentState.bucket('bucket')[1]).to.eql(obj2);
  });

  it('proviedes convinient way of removing data', () => {
    const obj = { id: 1, param: 'value' };
    currentState.addObject('bucket', obj);

    currentState.removeObject('bucket', 1);

    expect(currentState.bucket('bucket')).to.eql([]);
  });
});
