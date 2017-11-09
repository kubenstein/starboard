import { Starboard, GitStrategy } from '../lib';

const logger = console;

const gitStrategy = new GitStrategy({
  pathToTempLocalRepo: '.tmp/tmpRepo/',
  remoteRepoUrl: process.env.REPO_URL,
  logger,
});

new Starboard({
  port: 8081,
  strategy: gitStrategy,
  logger,
}).start();
