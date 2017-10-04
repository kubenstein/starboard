#!/bin/bash

LOCAL_REPO_DIR='/tmp/starboard/projects/starboard/' \
SYNCING_INTERVAL=60 \
REPO_URL=$(git remote show dropbox | grep 'Fetch URL' | cut -d' ' -f5) \
starboard