import {
  Starboard,
  GitContainer,
  GitEventStorage,
  GitFilesStorage,
} from '../lib';

const logger = console;

const gitContainer = new GitContainer({
  pathToTempLocalRepo: '.tmp/tmpRepo/',
  remoteRepoUrl: process.env.REPO_URL,
  logger,
});

const eventStorage = new GitEventStorage({ gitContainer });

const filesStorage = new GitFilesStorage({ gitContainer });

new Starboard({
  port: 8081,
  filesStorage,
  eventStorage,
  logger,
}).start();
