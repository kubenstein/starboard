import React from 'react';
import CurrentState from 'lib/current-state.js';
import EventStorage from 'lib/server-event-storage.js';
import Board from 'components/Board/Board.jsx';
import Login from 'components/Login/Login.jsx';

export default class Bootstrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  logIn(username, email) {
    this.eventStorage = new EventStorage();
    this.stateManager = new CurrentState({
      eventSource: this.eventStorage,
      user: {
        name: username,
        email: email
      }
    });
    this.setState({ loggedIn: true });
  }

  render() {
    return this.state.loggedIn ?
      <Board stateManager={this.stateManager} />
    :
      <Login onLogIn={(user, email) => { this.logIn(user, email); }} />;
  }
}
