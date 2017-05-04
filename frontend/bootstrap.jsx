import React from 'react';
import ReactDOM from 'react-dom';
import CurrentState from 'lib/current-state.js';
import MemoryEventStorage from 'lib/memory-event-storage.js';
import EventSeedGenerator from 'lib/event-seed-generator.js';
import Board from 'components/Board/Board.jsx';
import 'assets/stylesheets/style.scss';


const eventStotage = new MemoryEventStorage({ logger: console });
const stateManager = new CurrentState({
  eventSource: eventStotage
});

new EventSeedGenerator(eventStotage).generate();

ReactDOM.render(
  <Board stateManager={stateManager} />,
  document.getElementById('app')
);
