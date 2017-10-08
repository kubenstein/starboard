import 'es6-promise/auto';

import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'components/Bootstrap';

import DependencyInjector from 'lib/dependency-injector';
import FrontendAppState from 'lib/frontend-app-state';
import ServerEventStorage from 'lib/eventStorages/server-event-storage';
import MemoryEventStorage from 'lib/eventStorages/memory-event-storage';
import ThemeStyler from 'components/Board/theme-styler';
import UserSessionService from 'lib/services/user-session-service';
import BrowserSettingsService from 'lib/services/browser-settings-service';
import ServerFileUploader from 'lib/fileUploaders/server-file-uploader';
import ColumnsRepository from 'lib/repositories/columns-repository';
import CardsRepository from 'lib/repositories/cards-repository';
import SettingsRepository from 'lib/repositories/settings-repository';
import ActivitiesRepository from 'lib/repositories/activities-repository';
import UsersRepository from 'lib/repositories/users-repository';
import CommentsRepository from 'lib/repositories/comments-repository';
import UiRepository from 'lib/repositories/ui-repository';
import './assets';

const deps = new DependencyInjector();
deps
  .set('commentsRepository', di => new CommentsRepository(di.get('stateManager'), di.get('fileUploader')))
  .set('usersRepository', di => new UsersRepository(di.get('stateManager'), di.get('fileUploader')))
  .set('activitiesRepository', di => new ActivitiesRepository(di.get('stateManager')))
  .set('settingsRepository', di => new SettingsRepository(di.get('stateManager')))
  .set('cardsRepository', di => new CardsRepository(di.get('stateManager')))
  .set('columnsRepository', di => new ColumnsRepository(di.get('stateManager')))
  .set('uiRepository', di => new UiRepository(di.get('stateManager')))
  .set('themeStyler', di => new ThemeStyler(di.get('stateManager')))
  .set('userSessionService', () => new UserSessionService())
  .set('browserSettingsService', di => new BrowserSettingsService(di.get('stateManager')))
  .set('fileUploader', () => new ServerFileUploader())
  .set('appEventStorage', () => new MemoryEventStorage())
  .set('eventStorage', di => new ServerEventStorage({
    token: di.get('userSessionService').token(),
  }))
  .set('stateManager', di => new FrontendAppState({
    dataEventStorage: di.get('eventStorage'),
    appEventStorage: di.get('appEventStorage'),
    userId: di.get('userSessionService').userId(),
  }))
;


ReactDOM.render(
  <Bootstrap deps={deps} />,
  document.getElementById('app'),
);
