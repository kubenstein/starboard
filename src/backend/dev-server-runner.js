import { Starboard, GitStrategy, GitContainer } from '../lib';

const publicFilesDir = '.tmp/tmpRepo/';
const logger = console;

const gitContainer = new GitContainer({
  pathToTempLocalRepo: publicFilesDir,
  remoteRepoUrl: process.env.REPO_URL,
  logger,
});

const gitStrategy = new GitStrategy({
  gitContainer,
  logger,
});

new Starboard({
  port: 8081,
  strategy: gitStrategy,
  publicFilesDir,
  logger,
}).start();
