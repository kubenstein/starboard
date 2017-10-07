import React from 'react';
import PropTypes from 'prop-types';
import Board from 'components/Board';
import Login from 'components/Login';

export default class Bootstrap extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.deps = props.deps;
    this.session = this.deps.get('UserSessionService');
    this.state = {
      loggedIn: this.session.isLoggedIn(),
      loginError: false,
    };
  }

  logIn(email, password) {
    this.session.login(email, password)
    .then(() => {
      this.setState({ loggedIn: true, loginError: false });
    })
    .catch(() => {
      this.setState({ loginError: true });
    });
  }

  render() {
    const { loggedIn, loginError } = this.state;
    return loggedIn ?
      <Board deps={this.deps} />
    :
      <Login
        displayError={loginError}
        onLogIn={(email, password) => { this.logIn(email, password); }}
      />;
  }
}
