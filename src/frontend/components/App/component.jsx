import React from 'react';
import PropTypes from 'prop-types';
import Board from 'components/Board';
import Login from 'components/Login';

export default class App extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      isLoggedIn ? (
        <Board />
      ) : (
        <Login />
      )
    );
  }
}
