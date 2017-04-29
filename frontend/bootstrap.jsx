import React from 'react';
import ReactDOM from 'react-dom';
import EventStore from 'lib/event-store.js';
import Board from 'components/Board/Board.jsx';
import 'assets/stylesheets/style.scss';

const eventStore = new EventStore();

ReactDOM.render(
  <Board eventStore={eventStore} />,
  document.getElementById('app')
);
