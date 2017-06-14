export default class AllowEveryoneAuth {
  welcomeInfo() {
    return 'Auth: allow everyone';
  }

  grantAccessWithCredentials(email, _password) {
    return Promise.resolve({
      userId: email,
      token: 'AllowEveryoneToken'
    });
  }

  grantAccess(_token) {
    return Promise.resolve();
  }

  allowEvent(_event, _token) {
    return Promise.resolve();
  }
}
