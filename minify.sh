#!/bin/bash
rm psmin*.js
timestamp=$(date "+%Y%m%d-%H%M%S")
filepath="psmin_$timestamp.js"
echo Creating psmin file: $filepath

uglifyjs js/*.js js/*/*.js js/*/*/*.js -o $filepath

sed -i -E "s@(psmin_)[0-9\-]+@$filepath@g" index.html
cp index.html test.html

echo Done
