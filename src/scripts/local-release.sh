#!/bin/bash
#
# Run from root of the project
#

npm run build
npm pack
npm install -g `ls | grep tgz`
