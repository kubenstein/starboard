const lib = require('../../../.tmp/specs/src/starboard.js');

const Starboard = lib.Starboard;
const storage = (new lib.MemoryEventStorageFactory()).forBackendWithStoredFiles();

const server = new Starboard({
  port: 4444,
  eventStorage: storage,
  uploadsDir: './.tmp/specs/uploads',
  noBanner: true
});

exports.server = server;
exports.storage = storage;
