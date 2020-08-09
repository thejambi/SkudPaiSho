# Skud Pai Sho

Skud Pai Sho is the most accessible, playable, and complete ruleset for Pai Sho. Play online and learn more at [The Garden Gate - SkudPaiSho.com](https://skudpaisho.com).

# Local Development

I recommend using [VSCode](https://code.visualstudio.com/) or a similar editor to work in.

This npm package is needed:
`npm install uglify-js -g`

Then, run the minify script to "compile" the javascript code and update the index.html to reference the updated code. Also run this whenever you want to test any changes.
`./minify`

Then open up the `index.html` file (on a Mac, I've found that Safari's dev tools work the best - Chrome and Firefox freeze up for me).

