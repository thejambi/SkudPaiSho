#!/bin/bash
rm psmin*.js
timestamp=$(date "+%Y%m%d-%H%M%S")
filepath="psmin_$timestamp.js"
echo Creating psmin file: $filepath

babel js/*.js js/*/*.js js/*/*/*.js -o $filepath

sed -i.bu -E "s/(psmin_)[0-9\-]+\.js/$filepath/g" index.html
cp index.html test.html

echo Done
