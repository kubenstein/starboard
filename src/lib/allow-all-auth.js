export default class AllowAllAuth {
  info() {
    return 'Auth: allow all';
  }

  authWithCredentials(email, _password) {
    return Promise.resolve({
      userId: email,
      token: 'AllowAllToken',
    });
  }

  authWithToken(_token) {
    return Promise.resolve(true);
  }

  allowEvent(_event, _token) {
    return Promise.resolve(true);
  }

  allowStoringFile(_token) {
    return Promise.resolve(true);
  }

  allowDownloadingFile(_fileName, _token) {
    return Promise.resolve(true);
  }
}
