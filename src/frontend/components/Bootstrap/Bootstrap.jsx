import React from 'react';
import CurrentState from 'lib/current-state.js';
import EventStorage from 'lib/server-event-storage.js';
import Board from 'components/Board/Board.jsx';
import Login from 'components/Login/Login.jsx';
import {
  alreadyLoggedIn,
  storeLoginData,
  loginData
} from 'components/Bootstrap/login-tools.js';

export default class Bootstrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
    if (alreadyLoggedIn()) {
      this.state.loggedIn = true;
      this.configureAppForLoggedInUser();
    }
  }

  logIn(username, email) {
    storeLoginData(username, email);
    this.configureAppForLoggedInUser();
    this.setState({ loggedIn: true });
  }

  configureAppForLoggedInUser() {
    const user = loginData();

    this.stateManager = new CurrentState({
      eventSource: new EventStorage(),
      user: {
        name: user.username,
        email: user.email
      }
    });
  }

  render() {
    return this.state.loggedIn ?
      <Board stateManager={this.stateManager} />
    :
      <Login onLogIn={(user, email) => { this.logIn(user, email); }} />;
  }
}
