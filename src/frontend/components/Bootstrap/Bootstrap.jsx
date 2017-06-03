import React from 'react';
import CurrentState from 'lib/current-state.js';
import EventStorage from 'lib/server-event-storage.js';
import Board from 'components/Board/Board.jsx';
import Login from 'components/Login/Login.jsx';
import {
  alreadyLoggedIn,
  storeLoginEmail,
  loginEmail
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

  logIn(email) {
    storeLoginEmail(email);
    this.configureAppForLoggedInUser();
    this.setState({ loggedIn: true });
  }

  configureAppForLoggedInUser() {
    this.stateManager = new CurrentState({
      eventSource: new EventStorage(),
      userId: loginEmail()
    });
  }

  render() {
    return this.state.loggedIn ?
      <Board stateManager={this.stateManager} />
    :
      <Login onLogIn={(email) => { this.logIn(email); }} />;
  }
}
