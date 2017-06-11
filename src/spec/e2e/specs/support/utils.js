const lib = require('../../../../../.tmp/specs/src/starboard.js');

exports.login = function (loginId) {
  browser.url('/');
  browser.setCookie({ name: 'userId', value: loginId });
  browser.setCookie({ name: 'token', value: 'test' });
  browser.url('/');
};

exports.logout = function () {
  browser.deleteCookie();
  browser.url('/');
};

exports.createColumn = function (name, stateManager) {
  new lib.ColumnsRepository(stateManager).addColumn(name);
};

exports.createCard = function (name, options, stateManager) {
  const cardsRepo = new lib.CardsRepository(stateManager);
  const firstColumn = new lib.ColumnsRepository(stateManager).columnsSortedByPosition()[0];
  cardsRepo.addCard(name, firstColumn.id);
  const card = cardsRepo.cardsSortedByPosition(firstColumn.id).reverse()[0];

  const labels = options.labels || [];
  labels.forEach((label) => {
    cardsRepo.updateLabel(card.id, label, true);
  });
};

exports.setTextForLabel = function (color, text, stateManager) {
  new lib.SettingsRepository(stateManager).setTextForLabel(color, text);
};

exports.addComment = function (cardTitle, authorId, commentBody, stateManager) {
  const cardsRepo = new lib.CardsRepository(stateManager);
  const commentsRepo = new lib.CommentsRepository(stateManager);
  const firstColumn = new lib.ColumnsRepository(stateManager).columnsSortedByPosition()[0];
  const card = cardsRepo.cardsSortedByPosition(firstColumn.id).find((c) => {
    return c.title === cardTitle;
  });
  commentsRepo.addComment(card.id, {
    content: commentBody,
    authorId: authorId
  });
};
