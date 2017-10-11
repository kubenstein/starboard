const expect = require('chai').expect;
const state = require('../components.js').state;
const e = require('../components.js').eventDefinitions;

describe('state', () => {
  beforeEach(() => { return state.purge(); });

  it('has initial buckets empty', () => {
    expect(state.bucket('dummy1')).to.eql([]);
    expect(state.bucket('dummy2')).to.eql([]);
  });

  it('ignores unknown/noop events', () => {
    const unknownEvent = {
      type: 'unknown',
      id: 'unknown',
    };
    expect(state.data).to.eql({});
    state.addEvent(unknownEvent);
    state.addEvent(e.noopEvent());
    expect(state.data).to.eql({});
  });

  it('proviedes convinient way of finding data', () => {
    const obj = { id: 1, param: 'value' };
    state.addObject('bucket', obj);

    expect(state.objectData('bucket', 1)).to.eq(obj);
  });

  it('proviedes convinient way of adding data to a bucket', () => {
    const obj = { id: 1, param: 'value' };
    state.addObject('bucket', obj);

    expect(state.bucket('bucket')).to.eql([obj]);
  });

  it('proviedes convinient way of updating data', () => {
    const obj1 = { id: 1, param: 'value1' };
    const obj2 = { id: 2, param: 'value2' };
    state.addObject('bucket', obj1);
    state.addObject('bucket', obj2);

    state.updateObject('bucket', 1, { param: 'new' });

    expect(state.bucket('bucket')[0]).to.eql({ id: 1, param: 'new' });
    expect(state.bucket('bucket')[1]).to.eql(obj2);
  });

  it('proviedes convinient way of removing data', () => {
    const obj = { id: 1, param: 'value' };
    state.addObject('bucket', obj);

    state.removeObject('bucket', 1);

    expect(state.bucket('bucket')).to.eql([]);
  });
});
