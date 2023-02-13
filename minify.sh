#!/bin/bash
rm psmin*.js
timestamp=$(date "+%Y%m%d-%H%M%S")
filepath="psmin_$timestamp.js"
stylepath="style\/main.css\?v=$timestamp"
echo Creating psmin file: $filepath

uglifyjs js/*.js js/**/*.js -o $filepath

sed -i.bu -E "s/(psmin_)[0-9\-]+\.js/$filepath/g; s/style\/main\.css\?v\=[0-9\-]+/$stylepath/g" index.html
cp index.html test.html

echo Done
