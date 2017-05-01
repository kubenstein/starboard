import React from 'react';
import ReactDOM from 'react-dom';
import CurrentState from 'lib/current-state.js';
import ServerEventStorage from 'lib/server-event-storage.js';
import Board from 'components/Board/Board.jsx';
import 'assets/stylesheets/style.scss';

const eventStotage = new ServerEventStorage();
const stateManager = new CurrentState({
  eventSource: eventStotage
});

ReactDOM.render(
  <Board stateManager={stateManager} />,
  document.getElementById('app')
);
