import Starboard from './server.js';

new Starboard({
  port: process.env.PORT,
  remoteRepoUrl: process.env.REPO_URL,
  logger: console
}).start();
