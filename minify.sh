#!/bin/bash

previouspath=$(ls psmin*)
echo Replacing: $previouspath

rm psmin*.js

timestamp=$(date "+%Y%m%d-%H%M%S")
filepath="psmin_$timestamp.js"
echo With: $filepath

uglifyjs js/*.js js/*/*.js js/*/*/*.js -o $filepath

sed -i -e "s@$previouspath@$filepath@g" index.html
cp index.html test.html

echo Done
