var http = require('http')
var fs = require('fs')
var stream = require('youtube-audio-stream')
var path = require('path');
var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(__dirname));

app.get(/^\/watch/, function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get(/youtube/, function (req, res) {
  stream(req.url.slice(1)).pipe(res);
})

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), "localhost", function() {
  console.log('open http://localhost:3000 for demo of audio stream')
})

/*
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
    console.log("fdsafdsafda");
    stream(req.url.slice(1)).pipe(res)
  }
}
*/
