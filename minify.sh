#!/bin/bash

rm js/psmin.js
uglifyjs js/*.js js/*/*.js -o js/psmin.js