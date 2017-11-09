export default class AllowAllAuth {
  welcomeInfo() {
    return 'Auth: allow all';
  }

  authWithCredentials(email, _password) {
    return Promise.resolve({
      userId: email,
      token: 'AllowEveryoneToken',
    });
  }

  authWithToken(_token) {
    return Promise.resolve();
  }

  allowEvent(_event, _token) {
    return Promise.resolve();
  }

  allowStoringFile(_token) {
    return Promise.resolve();
  }

  allowDownloadingFile(_fileName, _token) {
    return Promise.resolve();
  }
}
