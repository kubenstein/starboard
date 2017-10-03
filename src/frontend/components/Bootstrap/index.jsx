import React from 'react';
import Board from 'components/Board';
import Login from 'components/Login';
import CurrentState from 'lib/current-state';
import ServerEventStorage from 'lib/eventStorages/server-event-storage';
import UserSessionService from 'lib/services/user-session-service';

export default class Bootstrap extends React.Component {
  constructor() {
    super();
    this.session = new UserSessionService();
    this.state = { loggedIn: false, loginError: false };

    if (this.session.isLoggedIn()) {
      this.state.loggedIn = true;
      this.configureAppForLoggedInUser();
    }
  }

  logIn(email, password) {
    this.session.login(email, password)
    .then(() => {
      this.configureAppForLoggedInUser();
      this.setState({ loggedIn: true, loginError: false });
    })
    .catch(() => {
      this.setState({ loginError: true });
    });
  }

  configureAppForLoggedInUser() {
    const storage = new ServerEventStorage({
      token: this.session.token()
    });
    this.stateManager = new CurrentState({
      eventStorage: storage,
      userId: this.session.userId()
    });
  }

  render() {
    const { loggedIn, loginError } = this.state;
    return loggedIn ?
      <Board stateManager={this.stateManager} />
    :
      <Login
        displayError={loginError}
        onLogIn={(email, password) => { this.logIn(email, password); }}
      />;
  }
}
