/* eslint no-undef: 0 */

const server = require('../components.js').server;
const currentState = require('../components.js').currentState;
const utils = require('./support/utils.js');
require('./support/steps.js')();

const createColumn = utils.createColumn;

describe('Column', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
  });

  after(() => {
    utils.logout();
    server.stop();
  });

  beforeEach(() => {
    currentState.purge();
    and.reload();
  });

  it('can be created', () => {
    userCanNotSee('column title');
    following.creatingColumn('column title');
    userCanSeeColumn('column title');
  });

  it('can be renamed', () => {
    createColumn('old column title', currentState);

    following.renamingColumn('old column title', 'new column title');
    userCanSeeColumn('new column title');
    and.userCanNotSeeColumn('old column title');
  });

  it('can be removed', () => {
    createColumn('column to remove', currentState);

    following.removingColumn('column to remove');
    userCanNotSeeColumn('column to remove');
  });
});
