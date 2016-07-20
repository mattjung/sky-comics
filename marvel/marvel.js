var urljoin = require('url-join')
var assign = require('object-assign')
var request = require('xhr-request')
var md5 = require('md5')
var publicKey = require('./key-public.json')
var privateKey = require('./key-private.json')

var version = 'v1'
var endpoint = 'https://gateway.marvel.com'

module.exports.search = search
module.exports.getFeaturedComics = getFeaturedComics

function getFeaturedComics (query, cb) {

  marvelApi('comics', {
    privateKey: privateKey,
    publicKey: publicKey,
    query:
      {
        format: "comic",
        dateDescriptor: "thisWeek",
        limit: 10
        // titleStartsWith: "Iron man"
    },
    timeout: 6000
  }, function (err, body, resp) {
    console.log("here");

    if (err) {
      console.log("error 1");

      return cb(new Error('invalid request; Marvel server may have timed out'))
    }
    if (!(/^2/.test(resp.statusCode))) {
      console.log(body.message);

      return cb(new Error(body.status || body.message))
    }

    var itemsProcessed = 0;
    var data = body.data
    var images = [];

    data.results
      .forEach(function (item) {

        if (typeof item.images !== 'undefined' && item.images.length > 0) {
          var thumb = item.images[0]
          console.log(item.images);
          var uri = thumb.path + '/portrait_fantastic.' + thumb.extension
          images.push(uri)
        }else{
          images.push("http://www.mrgraymedia.co.uk/gcsemedia/images/comics/superman.jpg");
        }
        itemsProcessed++;
        if(itemsProcessed === data.results.length) {
          cb(images);
        }
      })
    })
}


function search (query, cb) {

  marvelApi('comics', {
    privateKey: privateKey,
    publicKey: publicKey,
    query:
      {
        limit: 10,
        titleStartsWith: query
    },
    timeout: 6000
  }, function (err, body, resp) {

    if (err) {
      console.log("error 1");

      return cb(new Error('invalid request; Marvel server may have timed out'))
    }
    if (!(/^2/.test(resp.statusCode))) {
      console.log(body.message);

      return cb(new Error(body.status || body.message))
    }

    var itemsProcessed = 0;
    var data = body.data
    var images = [];

    data.results
      .forEach(function (item) {
        if (typeof item.images !== 'undefined' && item.images.length > 0) {
          var thumb = item.images[0]
          console.log(item.images);
          var uri = thumb.path + '/portrait_fantastic.' + thumb.extension
          images.push(uri)
        }else{
          images.push("http://www.mrgraymedia.co.uk/gcsemedia/images/comics/superman.jpg");
        }
        itemsProcessed++;
        if(itemsProcessed === data.results.length) {
          cb(images);
        }
      })
    })
}


function marvelApi (api, opt, cb) {

  opt = assign({ json: true }, opt)

  if (typeof api !== 'string') {
    throw new TypeError('marvel-comics-api must specify an API to request')
  }

  var privateKey = opt.privateKey
  var publicKey = opt.publicKey
  if (typeof publicKey !== 'string') {
    throw new TypeError('marvel-comics-api must specify a publicKey')
  }


  var auth = {
    apikey: publicKey
  }

  // private key is optional in the browser
  if (typeof privateKey === 'string') {
    auth.ts = String(Date.now())
    auth.hash = md5(auth.ts + privateKey + publicKey)
  }

  opt.query = assign({}, opt.query, auth)

  // strip start and end slash to avoid Marvel 404ing
  api = api.replace(/^\/|\/$/g, '')
  var url = urljoin(endpoint, version, 'public', api)
  console.log(url);
  console.log(opt);

  return request(url, opt, cb)
}
