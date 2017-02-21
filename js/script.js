var player;
var fftbins;

function setup(){
  var x = window.location.href;
  console.log(x.replace(/localhost[^\/]*\//, "www.youtube.com/"));
  audio = new youtubeAudio(x.replace(/http:\/\/localhost[^\/]*\//, "www.youtube.com/"));
  audio.play();
  createCanvas(600,600);
}

function draw(){
  background(0);
  fftbins = audio.FFT();
  console.log(audio.getBass());
  noFill();
  beginShape();
  stroke(255,255,255);
  var x = 0;
  var y = 0;
  for (var i = 0; i < fftbins.length; i++) {
    var v = fftbins[i] / 128.0;
    var y = v * 600 / 2;

    vertex(x, y);

    x += width/fftbins.length;
  }
  endShape();
}