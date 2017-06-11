/* eslint no-undef: 0 */

const server = require('../components.js').server;
const currentState = require('../components.js').currentState;
const utils = require('./support/utils.js');
require('./support/steps.js')();

describe('Comment', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
    utils.createColumn('column', currentState);
    utils.createCard('card', {}, currentState);
    openingCardDetails('card');
  });

  after(() => {
    utils.logout();
    server.stop();
    currentState.purge();
  });

  it('can be added', () => {
    following.postingTextComment('comment body');
    userCanSee('comment body');
    and.userCanSee('test@test.pl');
  });

  it('is displayed with user nickname', () => {
    following.postingTextComment('comment body');
    userCanSee('comment body');
    and.userCanSee('test@test.pl');
  });

  it('can be removed', () => {
    const content = 'comment to remove';
    following.postingTextComment(content);
    userCanSee(content);
    then.following.removingComment(content);
    userCanNotSee(content);
  });

  xit('can be added with an image attachment', () => {
  });

  xit('can be added with a file attachment', () => {
  });
});
