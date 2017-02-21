var http = require('http')
var fs = require('fs')
var stream = require('./js/youtubeaudiostream.js')
var path = require('path');

http.createServer(demo).listen(3000);

function demo (req, res) {
	console.log(req.url);
  if (req.url === '/' || /^\/watch/.test(req.url)) {
    console.log('1');
    return fs.createReadStream(path.join(__dirname, '/index.html')).pipe(res)
  }
  if (req.url === '/js/vendor/p5.js') {
     console.log('2');
    return fs.createReadStream(path.join(__dirname, '/js/vendor/p5.js')).pipe(res)
  }
  if (req.url === '/js/rings.js') {
    console.log('3');
    return fs.createReadStream(path.join(__dirname, '/js/rings.js')).pipe(res)
  }
  if (req.url === '/js/youtubeAudioClass.js') {
     console.log('4');
    return fs.createReadStream(path.join(__dirname, '/js/youtubeAudioClass.js')).pipe(res)
  }
  if (/youtube/.test(req.url)) {
    stream(req.url.slice(1)).pipe(res)
    return;
  }

  res.write('');
}

console.log('open http://localhost:3000 for demo of audio stream')
