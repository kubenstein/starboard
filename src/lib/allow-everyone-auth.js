export default class AllowEveryoneAuth {
  welcomeInfo() {
    return 'Auth: allow everyone';
  }

  authWithCredentials(email, _password) {
    return Promise.resolve({
      userId: email,
      token: 'AllowEveryoneToken'
    });
  }

  authWithToken(_token) {
    return Promise.resolve();
  }

  allowEvent(_event, _token) {
    return Promise.resolve();
  }
}
