export default class AllowEveryoneAuth {
  welcomeInfo() {
    return `Auth: allow everyone`;
  }

  accept(email, _password) {
    return Promise.resolve({
      userId: email,
      token: 'AllowEveryoneToken'
    });
  }

  allow(_token) {
    return Promise.resolve();
  }
}
