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
  return new lib.ColumnsRepository(stateManager).addColumn(name);
};

exports.createCard = function (name, options, stateManager) {
  const cardsRepo = new lib.CardsRepository(stateManager);
  const firstColumn = new lib.ColumnsRepository(stateManager).columnsSortedByPosition()[0];
  return cardsRepo.addCard(name, firstColumn.id)
  .then(() => {
    const card = cardsRepo.cardsSortedByPosition(firstColumn.id).reverse()[0];
    const labels = options.labels || [];
    const labelUpdates = labels.map((label) => {
      return cardsRepo.updateLabel(card.id, label, true);
    });

    return Promise.all(labelUpdates);
  });
};

exports.setTextForLabel = function (color, text, stateManager) {
  return new lib.SettingsRepository(stateManager).setTextForLabel(color, text);
};

exports.addComment = function (cardTitle, authorId, commentBody, stateManager) {
  const cardsRepo = new lib.CardsRepository(stateManager);
  const commentsRepo = new lib.CommentsRepository(stateManager);
  const firstColumn = new lib.ColumnsRepository(stateManager).columnsSortedByPosition()[0];
  const card = cardsRepo.cardsSortedByPosition(firstColumn.id).find((c) => {
    return c.title === cardTitle;
  });
  return commentsRepo.addComment(card.id, {
    content: commentBody,
    authorId: authorId,
  });
};

exports.setNickname = function (userId, nickname, stateManager) {
  return new lib.UsersRepository(stateManager).setUserNickname(userId, nickname);
};
