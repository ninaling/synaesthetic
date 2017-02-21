var http = require('http')
var fs = require('fs')
var stream = require('..')
var path = require('path');

http.createServer(demo).listen(3000);

function demo (req, res) {
	console.log(req.url);
  if (req.url === '/' || /^\/watch/.test(req.url)) {
    return fs.createReadStream(path.join(__dirname, '/server.html')).pipe(res)
  }
  if (req.url === '/p5.js') {
    return fs.createReadStream(path.join(__dirname, '/p5.js')).pipe(res)
  }
  if (req.url === '/video.js') {
    return fs.createReadStream(path.join(__dirname, '/video.js')).pipe(res)
  }
  if (req.url === '/youtubeAudioClass.js') {
    return fs.createReadStream(path.join(__dirname, '/youtubeAudioClass.js')).pipe(res)
  }
  if (/youtube/.test(req.url)) {
    stream(req.url.slice(1)).pipe(res)
  }
}

console.log('open http://localhost:3000 for demo of audio stream')
