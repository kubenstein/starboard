Starboard [![Build Status](https://travis-ci.org/kubenstein/starboard.png?branch=master)](https://travis-ci.org/kubenstein/starboard)
=============

Keep all aspects of a project in one place together! A card-based management tool that stores data in a git repo.

[![Starboard Screenshot](https://github.com/kubenstein/starboard/blob/master/starboard-screenshot.jpg)](https://vimeo.com/221797050)
Click the image for a demo video.

### Reasoning

Main Starboard idea is to keep, distribute and archive all programming and non-programming artefacts in a single place.

Source code is only a one part of a project. Other, also important, is management history like list of grouped and prioritised tasks with their characteristics, comments and related files.

See a blogpost: http://www.jakubniewczas.pl/#/blog/starboard-git-based-task-managment-tool


### Installation

```
npm install -g starboard
```


### Usage

Typically Starboard is run on localhost so each user serves Starboard for themselves.

```
REPO_URL=<path/url to origin repo> starboard
```

`REPO_URL` can be a local path (f.e. to dropbox) or a remote server (f.e. bitbucket or github).

In case remote server requires ssh key, `SSH_KEY_PATH` env has to be also provided.

List of config variables can be found in [Starboard command line program](https://github.com/kubenstein/starboard/blob/master/bin/starboard).

Starboard can also run on a public server (however auth/permission module is still under development).

#### Advanced usage
Check also a sister project [Starbucket](https://github.com/kubenstein/starbucket) to fully utilise decentralised aspect of git. Become Github/Bitbucket independent.

#### Lib

Starboard is designed as a lib, and `starboard` command is just one of many possible configuration of its components. It has a pluggable system of storages and authenticators. List of all exposed components can be found [here](https://github.com/kubenstein/starboard/blob/master/src/lib.js).

### Technical overview
Starboard is an event sourced app that use websockets for communication with backend. Frontend is written in React. Git is just one of many event storages that stores event jsons as a commit messages. Both frontend and backend calculate CurrentState from events. Repositories use CurrentState to read requested data.

Events are synced by git rebasing existing events on top on a remote list. After rebasing, events delta is applied (excluding rebased events). Because of that Event Handlers have to be prepared that something may not make any sense (handling such situations is still under development), for example, updating a card after the card was removed. Alternatively I could rebase remote events on top on local, or change git history in any other way, but it would require force push which I wanted to avoid. I was considering force push inspired by blockchains mechanic but I still prefer not to modify public repo.

### Production Readiness
I use Starboard for quite a while already but mostly in a single user mode. Storage in my case is usually Dropbox but I successfully ran Starboard with Bitbucket setupas well. Collaborative mode works pretty well also however there are still a few glitches here and there that I have already on my development list.

### Development

```
npm run dev:db:create
npm run dev
```
Then visit `http://localhost:8080/`.
Current version uses `AllowEveryone` Policy so any email is allowed and any text as a password is valid.


### Tests

```
npm run specs
```

### License
MIT
