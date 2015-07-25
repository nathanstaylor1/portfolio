var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'nst:home = Get to know me;'});
});

/* GET work page. */
router.get('/work', function(req, res, next) {
  res.render('work', { title: 'nst:work = Examples of my work;'});
});

/* GET play page. */
router.get('/play', function(req, res, next) {
  res.render('play', { title: 'nst:play = Fun snippets of code;'});
});

	/* Get play pages */

router.get('/play/connectfour', function(req, res, next) {
  res.render('play/connectfour', { title: 'nst:play:connect4 = A game of connect four;'});
});

router.get('/play/snippets/connectfour/', function(req, res, next) {
  res.render('play/snippets/connectfour');
});

// --

router.get('/play/balls', function(req, res, next) {
  res.render('play/balls', { title: 'nst:play:balls = Javascript animation of balls in a room;'});
});

router.get('/play/snippets/balls/', function(req, res, next) {
  res.render('play/snippets/balls');
});

// --

router.get('/play/spinners', function(req, res, next) {
  res.render('play/spinners', { title: 'nst:play:spinners = Some CSS spinners I made;'});
});

router.get('/play/snippets/spinners/', function(req, res, next) {
  res.render('play/snippets/spinners');
});

// --

router.get('/play/twinkle', function(req, res, next) {
  res.render('play/twinkle', { title: 'nst:play:twinkle = Shining stars animation;'});
});

router.get('/play/snippets/twinkle/', function(req, res, next) {
  res.render('play/snippets/twinkle');
});

// --

router.get('/play/spritewars', function(req, res, next) {
  res.render('play/spritewars', { title: 'nst:play:sprite wars = An oldschool sprite deathmatch;'});
});

router.get('/play/snippets/spritewars/', function(req, res, next) {
  res.render('play/snippets/spritewars');
});

// --

router.get('/play/stencillax', function(req, res, next) {
  res.render('play/stencillax', { title: 'nst:play:stencillax = Layered stencil parallax madness;'});
});

router.get('/play/snippets/stencillax/', function(req, res, next) {
  res.render('play/snippets/stencillax');
});




module.exports = router;