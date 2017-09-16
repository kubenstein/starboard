const lib = require('../../../.tmp/specs/src/starboard.js');

const storage = new lib.MemoryEventStorage();

exports.currentState = new lib.CurrentState({ eventSource: storage });
exports.lib = lib;
exports.eventDefinitions = lib.eventDefinitions;
