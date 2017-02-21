var http = require('http')
var fs = require('fs')
var stream = require('./js/youtubeaudiostream.js')
var path = require('path');

http.createServer(demo).listen(3000);

function demo (req, res) {
	console.log(req.url);
  if (req.url === '/' || /^\/watch/.test(req.url)) {
    return fs.createReadStream(path.join(__dirname, '/index.html')).pipe(res)
  }
  if (req.url === '/js/vendor/p5.js') {
    return fs.createReadStream(path.join(__dirname, '/js/vendor/p5.js')).pipe(res)
  }
  if (req.url === '/js/script.js') {
    return fs.createReadStream(path.join(__dirname, '/js/script.js')).pipe(res)
  }
  if (req.url === '/js/youtubeAudioClass.js') {
    return fs.createReadStream(path.join(__dirname, '/js/youtubeAudioClass.js')).pipe(res)
  }
  if (/youtube/.test(req.url)) {
    stream(req.url.slice(1)).pipe(res)
  }
}

console.log('open http://localhost:3000 for demo of audio stream')
