/* eslint no-undef: 0 */

const server = require('../components.js').server;
const state = require('../components.js').state;
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
    utils.createColumn('old column title', state);

    when.renamingColumn('old column title', 'new column title');
    userCanSeeColumn('new column title');
    and.userCanNotSeeColumn('old column title');
  });

  it('can be removed', () => {
    utils.createColumn('column to remove', state);
    then.userCanSeeColumn('column to remove');
    following.removingColumn('column to remove');
    and.visitingPage();
    userCanNotSeeColumn('column to remove');
  });
});
