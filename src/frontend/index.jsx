import 'es6-promise/auto';

import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'components/Bootstrap';
import DependencyInjector from 'lib/dependency-injector';
import UserSessionService from 'lib/services/user-session-service';
import CurrentState from 'lib/current-state';
import ServerEventStorage from 'lib/eventStorages/server-event-storage';
import './assets';

const deps = new DependencyInjector();
deps
  .set('UserSessionService', () => new UserSessionService())
  .set('sessionToken', di => di.get('UserSessionService').token())
  .set('EventStorage', di => new ServerEventStorage({
    token: di.get('sessionToken'),
  }))
  .set('StateManager', di => new CurrentState({
    eventStorage: di.get('EventStorage'),
    userId: di.get('sessionToken'),
  }))
;


ReactDOM.render(
  <Bootstrap deps={deps} />,
  document.getElementById('app'),
);
