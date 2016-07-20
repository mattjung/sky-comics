var urljoin = require('url-join')
var assign = require('object-assign')
var request = require('xhr-request')
var md5 = require('md5')
var publicKey = require('./key-public.json')
var privateKey = require('./key-private.json')

var version = 'v1'
var endpoint = 'https://gateway.marvel.com'

module.exports.search = search


function search (query, cb) {
  console.log('private:'+privateKey);

  marvelApi('comics', {
    privateKey: privateKey,
    publicKey: publicKey,
    query:
      {
        limit: 5,
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
        if (item.images[0] !== "undefined") {
          var thumb = item.images[0]
          var uri = thumb.path + '/portrait_fantastic.' + thumb.extension
          images.push(uri)
          itemsProcessed++;
          if(itemsProcessed === data.results.length) {

            cb(images);
          }
        }
      })
    })
}


function marvelApi (api, opt, cb) {
  console.log("here");

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
