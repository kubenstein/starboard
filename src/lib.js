/* eslint-disable no-multi-spaces */
exports.Starboard          = require('backend/server.js').default;
exports.eventDefinitions   = require('lib/event-definitions.js');
exports.CurrentState       = require('lib/current-state.js').default;
exports.GitContainer       = require('lib/git-container.js').default;
exports.GitFilesStorage    = require('lib/git-files-storage.js').default;
exports.GitEventStorage    = require('lib/eventStorages/git-event-storage.js').default;
exports.MemoryEventStorage = require('lib/eventStorages/memory-event-storage.js').default;
exports.ServerEventStorage = require('lib/eventStorages/server-event-storage.js').default;
exports.SettingsRepository = require('lib/repositories/settings-repository.js').default;
exports.CardsRepository    = require('lib/repositories/cards-repository.js').default;
exports.ColumnsRepository  = require('lib/repositories/columns-repository.js').default;
exports.CommentsRepository = require('lib/repositories/comments-repository.js').default;
exports.UsersRepository    = require('lib/repositories/users-repository.js').default;
exports.DependecyIjector   = require('lib/dependency-injector.js').default;
