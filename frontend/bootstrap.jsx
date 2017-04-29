import React from 'react';
import ReactDOM from 'react-dom';
import CurrentState from 'lib/current-state.js';
import Board from 'components/Board/Board.jsx';
import Seeds from 'lib/seeds.js';
import 'assets/stylesheets/style.scss';

const stateManager = new CurrentState();

new Seeds(stateManager).populate();

ReactDOM.render(
  <Board stateManager={stateManager} />,
  document.getElementById('app')
);
