exports.login = function(loginId) {
  browser.url('/');
  browser.setCookie({ name: 'userId', value: loginId });
  browser.setCookie({ name: 'token', value: 'test' });
  browser.url('/');
}