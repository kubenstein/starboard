import 'es6-promise/auto';

import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'components/Bootstrap';
import DependencyInjector from 'lib/dependency-injector';
import CurrentState from 'lib/current-state';
import ServerEventStorage from 'lib/eventStorages/server-event-storage';
import ThemeStyler from 'components/Board/theme-styler';
import UserSessionService from 'lib/services/user-session-service';
import BrowserSettingsService from 'lib/services/browser-settings-service';
import ColumnsRepository from 'lib/repositories/columns-repository';
import CardsRepository from 'lib/repositories/cards-repository';
import SettingsRepository from 'lib/repositories/settings-repository';
import ActivitiesRepository from 'lib/repositories/activities-repository';
import UsersRepository from 'lib/repositories/users-repository';
import CommentsRepository from 'lib/repositories/comments-repository';
import UserLogoutUsecase from 'lib/usecases/user-logout-usecase';
import './assets';

const deps = new DependencyInjector();
deps
  .set('commentsRepository', di => new CommentsRepository(di.get('stateManager')))
  .set('usersRepository', di => new UsersRepository(di.get('stateManager')))
  .set('activitiesRepository', di => new ActivitiesRepository(di.get('stateManager')))
  .set('settingsRepository', di => new SettingsRepository(di.get('stateManager')))
  .set('cardsRepository', di => new CardsRepository(di.get('stateManager')))
  .set('columnsRepository', di => new ColumnsRepository(di.get('stateManager')))
  .set('themeStyler', di => new ThemeStyler(di.get('stateManager')))
  .set('userSessionService', () => new UserSessionService())
  .set('browserSettingsService', di => new BrowserSettingsService(di.get('stateManager')))
  .set('userLogoutUsecase', di => new UserLogoutUsecase())
  .set('sessionToken', di => di.get('userSessionService').token())
  .set('eventStorage', di => new ServerEventStorage({ token: di.get('sessionToken') }))
  .set('stateManager', di => new CurrentState({
    eventStorage: di.get('eventStorage'),
    userId: di.get('sessionToken'),
  }))
;


ReactDOM.render(
  <Bootstrap deps={deps} />,
  document.getElementById('app'),
);
