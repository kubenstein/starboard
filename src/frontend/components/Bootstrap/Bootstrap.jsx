import React from 'react';
import CurrentState from 'lib/current-state.js';
import ServerEventStorage from 'lib/server-event-storage.js';
import Board from 'components/Board/Board.jsx';
import Login from 'components/Login/Login.jsx';
import UserSession from 'components/Bootstrap/user-session.js';

export default class Bootstrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
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
      this.setState({ loggedIn: true });
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
    return this.state.loggedIn ?
      <Board stateManager={this.stateManager} />
    :
      <Login onLogIn={(email, password) => { this.logIn(email, password); }} />;
  }
}
