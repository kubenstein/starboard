import { Starboard,
  GitContainer,
  GitEventStorage,
  GitFilesStorage,
} from '../lib';

const logger = console;

const gitContainer = new GitContainer({
  pathToTempLocalRepo: '.tmp/tmpRepo/',
  remoteRepoUrl: process.env.REPO_URL,
  logger: logger,
});

const eventStorage = new GitEventStorage({
  gitContainer: gitContainer,
});

const gitFilesStorage = new GitFilesStorage({
  gitContainer: gitContainer,
});

new Starboard({
  port: 8081,
  filesStorage: gitFilesStorage,
  eventStorage: eventStorage,
  logger: logger,
}).start();
