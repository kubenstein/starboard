import React from 'react';
import PropTypes from 'prop-types';
import Board from 'components/Board';
import Login from 'components/Login';

const App = ({ isLoggedIn }) => (
  isLoggedIn ? <Board /> : <Login />
);

App.propTypes = {
  isLoggedIn: PropTypes.bool,
};

export default App;
