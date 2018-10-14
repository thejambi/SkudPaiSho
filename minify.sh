#!/bin/bash

previouspath=$(ls js/psmin*)
echo Replacing: $previouspath

rm js/psmin*.js

timestamp=$(date "+%Y%m%d-%H%M%S")
filepath="js/psmin_$timestamp.js"
# echo $timestamp
echo With: $filepath

uglifyjs js/*.js js/*/*.js -o $filepath

sed -i -e "s@$previouspath@$filepath@g" index.html
cp index.html test.html

echo Done
