/* eslint no-undef: 0 */
const expect = require('chai').expect;

const currentState = require('../components.js').currentState;

describe('CurrentState', () => {
  it('has initial buckets empty', () => {
    expect(currentState.bucket('dummy1')).to.deep.eq([]);
    expect(currentState.bucket('dummy2')).to.deep.eq([]);
  });
});
