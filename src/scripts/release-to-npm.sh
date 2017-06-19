#!/bin/bash
#
# Run from root of the project
#


rm -f `ls | grep starboard*tgz`

npm run specs && \
npm run build && \
npm pack      && \
npm publish `ls | grep starboard*tgz`
