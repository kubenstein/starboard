import 'es6-promise/auto';

import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'components/Bootstrap';
import DependencyInjector from 'lib/dependency-injector';
import UserSessionService from 'lib/services/user-session-service';
import CurrentState from 'lib/current-state';
import ServerEventStorage from 'lib/eventStorages/server-event-storage';
import ThemeStyler from 'components/Board/theme-styler';
import ColumnsRepository from 'lib/repositories/columns-repository';
import CardsRepository from 'lib/repositories/cards-repository';

import './assets';

const deps = new DependencyInjector();
deps
  .set('cardsRepository', di => new CardsRepository(di.get('stateManager')))
  .set('columnsRepository', di => new ColumnsRepository(di.get('stateManager')))
  .set('themeStyler', di => new ThemeStyler(di.get('stateManager')))
  .set('userSessionService', () => new UserSessionService())
  .set('sessionToken', di => di.get('userSessionService').token())
  .set('eventStorage', di => new ServerEventStorage({
    token: di.get('sessionToken'),
  }))
  .set('stateManager', di => new CurrentState({
    eventStorage: di.get('eventStorage'),
    userId: di.get('sessionToken'),
  }))
;


ReactDOM.render(
  <Bootstrap deps={deps} />,
  document.getElementById('app'),
);
