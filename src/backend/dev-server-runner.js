import { Starboard } from '../lib.js';

new Starboard({
  port: process.env.PORT,
  remoteRepoUrl: process.env.REPO_URL,
  logger: console
}).start();
