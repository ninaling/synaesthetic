var http = require('http');
var fs = require('fs');
var stream = require('youtube-audio-stream');
var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(__dirname));

app.get(/^\/watch/, function (req, res) {
  res.sendFile(path.join(__dirname + '/synaesthetic.html'));
  console.log("hai");
});

app.get(/youtube/, function (req, res) {
  stream(req.url.slice(1)).pipe(res);
  console.log("hai2");
});

app.get('/', function(req, res) {
  res.render('index');
  console.log('hai3');
});

console.log(process.env.PORT);

// app.set('port', process.env.PORT || 3000);

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('open http://localhost:3000 for demo of audio stream')
})

/*
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
    console.log("fdsafdsafda");
    stream(req.url.slice(1)).pipe(res)
    return;
  }

  res.write('');
}
*/
