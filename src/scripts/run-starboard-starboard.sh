#!/bin/bash

TEMP_DIR='/tmp/starboard' \
POLLING_INTERVAL=-1       \
PORT=9000                 \
REPO_URL=$(git remote show dropbox | grep 'Fetch URL' | cut -d' ' -f5) \
starboard