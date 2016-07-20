var express = require('express');
var marvel = require('../marvel/marvel')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sky Comics Store' });
});

router.get('/landing', function(req, res, next) {
  res.render('landing', { title: 'Sky Comics' });
});

router.post('/doSearch', function(req, res, next) {
  marvel.search(req.body.query, function(images){
    res.json({ imageURLs: images });
  })
});

router.get('/getFeaturedComics', function(req, res, next) {

  marvel.getFeaturedComics(req.body.query, function(images){
    res.json({ imageURLs: images });
  })
});

module.exports = router;
