import fs from 'fs-extra';
import { execSync } from 'child_process';
import uuid from 'uuid/v4';

export function generateTmpRepoPath() {
  return `/tmp/starboard-git-specs/${uuid()}`;
}

export function generateRemoteRepoPath() {
  const path = `/tmp/starboard-git-specs/${uuid()}`;
  fs.ensureDirSync(path);
  execSync(`git init --bare ${path}`);
  return path;
}
