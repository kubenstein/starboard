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
