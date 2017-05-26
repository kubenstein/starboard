#!/bin/bash

TEMP_DIR='/tmp/starboard' \
SYNCING_INTERVAL=60       \
PORT=9000                 \
REPO_URL=$(git remote show dropbox | grep 'Fetch URL' | cut -d' ' -f5) \
starboard