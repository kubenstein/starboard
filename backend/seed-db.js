const EventStorage = require('../lib/git-event-storage.js');
const EventSeedGenerator = require('../lib/event-seed-generator.js');

const eventStotage = new EventStorage({
  pathToRepo: '/Users/Kuba/Desktop/test_repo'
});
new EventSeedGenerator(eventStotage).generate();
