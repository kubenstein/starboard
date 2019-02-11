/* eslint-disable no-undef, max-len, func-names, prefer-destructuring */

const server = require('../components.js').server;
const state = require('../components.js').state;
const utils = require('./support/utils.js');
require('./support/steps.js')();

describe('Card', () => {
  before(() => {
    server.start();
    utils.login('test@test.pl');
  });

  after(() => {
    utils.logout();
    server.stop();
  });

  beforeEach(() => utils
    .createColumn('column with cards', state)
    .then(() => visitingPage()),
  );

  afterEach(() => state.purge());

  it('can be created', () => {
    userCanNotSee('created card');
    following.creatingCard('created card');
    userCanSee('created card');
  });

  it('displays all its labels', () => {
    const labels = {
      hex: ['#00E6FF', '#3CB500'],
      rgba: ['rgba(0,230,255,1)', 'rgba(60,181,0,1)'],
    };

    utils.createCard('card with labels', { labels: labels.hex }, state);
    userCanSeeCardWithLabels('card with labels', labels.rgba);
  });

  it('displays amount of comments', () => {
    const card = 'card with comment Counter';
    utils.createCard(card, {}, state);

    userCanSeeCommentCounter(card, 0);

    utils.addComment(card, 'test@test.pl', 'comment 1', state);
    utils.addComment(card, 'test@test.pl', 'comment 2', state);
    utils.addComment(card, 'test@test.pl', 'comment 3', state);

    userCanSeeCommentCounter(card, 3);
  });
});
