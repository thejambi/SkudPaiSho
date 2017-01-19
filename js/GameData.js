var newKnotweedRules = true;  // They're good. Always on!
var simpleCanonRules = false;
var newSpecialFlowerRules = false;  // Special Flowers planted next to Growing Flower
var newGatesRule = true;  // Great! Always on! (New Gate Rules: Player cannot plant on Bonus if already controlling two Gates)
var newWheelRule = true;  // Wheel can be played next to Gate as long as it's ok. Always on.
var newOrchidClashRule = false; // Orchid clashes with all opponent Flowers... I don't think it's a good idea.
var newOrchidVulnerableRule = false;  // Testing new Orchid vulnerable rules
var newOrchidCaptureRule = false;  // Testing new Orchid capture rules
var simpleSpecialFlowerRule = false;  // Simplest special flower rule
var specialFlowerBonusRule = false; // Special Flowers can be moved on Harmony Bonus - not implemented
var rocksUnwheelable = true; // Rocks Unwheelable: Rocks cannot be moved by Wheel but can be removed by Boat. Boat can remove any Accent Tile.
var lotusNoCapture = true; // Lotus not able to be captured. Always on.
var simpleRocks = false;  // Rocks don't disable Harmonies.
var simplest = false; // Simple Accents and Special Flowers.
var lessBonus = false;  // Can only Plant on Bonus if no Growing Flowers.
var superHarmonies = false; // Any number flower harmonies with differently numbered flower.
var completeHarmony = false; // Harmony Ring must contain a 3, 4, and 5

var debugOn = true;

function debug(str) {
    if (debugOn) {
        console.log(str);
    }
}

// Tile Types

var BASIC_FLOWER = "Basic Flower";
var ACCENT_TILE = "Accent Tile";
var SPECIAL_FLOWER = "Special Flower";

var ROCK = "Rock";
var WHEEL = "Wheel";
var KNOTWEED = "Knotweed";
var BOAT = "Boat";

var WHITE_LOTUS = "White Lotus";
var ORCHID = "Orchid";



// polyfill
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.includes called on null or undefined');
    }

    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}