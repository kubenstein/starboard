/* eslint-disable no-undef, max-len, func-names, prefer-destructuring */

const server = require('../components.js').server;
const state = require('../components.js').state;
require('./support/steps.js')();

describe('User', () => {
  before(() => { server.start(); });
  after(() => { server.stop(); });
  beforeEach(() => {
    when.visitingPage();
    userCanSeeLoginPage();
  });
  afterEach(() => state.purge()
    .then(() => browser.deleteCookies()),
  );

  it('can log in', () => {
    when.loggingIn('test@test.pl', 'abcd');
    userCanSeeBoard();
  });

  it('can log out', () => {
    when.loggingIn('test@test.pl', 'abcd');
    and.then.loggingOut();
    userCanSeeLoginPage();
  });
});
