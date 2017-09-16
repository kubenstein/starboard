import React from 'react';
import CurrentState from 'lib/current-state';
import ServerEventStorage from 'lib/server-event-storage';
import Board from 'components/Board/Board';
import Login from 'components/Login/Login';
import UserSession from 'lib/user-session';

export default class Bootstrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false, loginError: false };
    this.session = new UserSession();

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
      eventSource: storage,
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
