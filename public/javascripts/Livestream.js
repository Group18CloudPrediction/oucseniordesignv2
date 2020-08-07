//This will be livestream javascript code
var requirejs = require('requirejs');
var jsmpeg = require('jsmpeg');

var player = new jsmpeg('video/sample_640x360.ts');

player.pause();
player.play();
player.stop();
