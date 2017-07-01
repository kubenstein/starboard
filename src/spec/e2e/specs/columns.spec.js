/* eslint no-undef: 0 */

const server = require('../components.js').server;
const currentState = require('../components.js').currentState;
const utils = require('./support/utils.js');
require('./support/steps.js')();

describe('Column', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
  });

  after(() => {
    utils.logout();
    server.stop();
  });

  beforeEach(() => { when.visitingPage(); });

  it('can be created', () => {
    userCanNotSee('created column');
    then.when.creatingColumn('created column');
    userCanSeeColumn('created column');
  });

  it('can be renamed', () => {
    utils.createColumn('old column title', currentState);

    when.renamingColumn('old column title', 'new column title');
    userCanSeeColumn('new column title');
    and.userCanNotSeeColumn('old column title');
  });

  it('can be removed', () => {
    utils.createColumn('column to remove', currentState);
    when.removingColumn('column to remove');
    userCanNotSeeColumn('column to remove');
  });
});
