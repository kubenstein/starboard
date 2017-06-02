import { Starboard, GitEventStorage } from '../lib.js';

const logger = console;
const pathToGitTempLocalRepo = '.tmp/tmpRepo/';

const storage = new GitEventStorage({
  remoteRepoUrl: process.env.REPO_URL,
  pathToTempLocalRepo: pathToGitTempLocalRepo,
  commiterEmail: 'starboardbot@starboard.dev',
  logger: logger
});

new Starboard({
  port: process.env.PORT,
  uploadsDir: pathToGitTempLocalRepo,
  logger: logger,
  eventStorage: storage
}).start();
