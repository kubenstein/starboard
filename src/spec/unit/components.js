const lib = require('../../../.tmp/specs/src/starboard.js');

const storage = (new lib.MemoryEventStorageFactory()).forBackendWithStoredFiles();

exports.currentState = new lib.CurrentState({ eventSource: storage });
exports.storage = storage;
exports.lib = lib;
exports.eventDefinitions = lib.eventDefinitions;
