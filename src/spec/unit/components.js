const lib = require('../../../.tmp/specs/src/starboard.js');

const storage = new lib.MemoryEventStorage();

exports.state = new lib.State({ eventStorage: storage });
exports.lib = lib;
exports.eventDefinitions = lib.eventDefinitions;
