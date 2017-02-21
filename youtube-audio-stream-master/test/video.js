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

//todo:
//let users input youtube link
//try using p5 and running analyser.getByteFrequencyData(frequencyData) in there
/*
window.addEventListener('load', function(){

var player = new window.Audio('youtube.com/watch?v=d3hTyKlza2c')
player.preload = 'metadata'
player.setAttribute("id", "myAudio");
player.controls = true
document.body.appendChild(player)
var canvasElement = document.createElement("canvas");
canvasElement.setAttribute("id", "oscilloscope");
document.body.appendChild(canvasElement);

 var ctx = new AudioContext();
  var audio = document.getElementById('myAudio');
  var hidden = document.getElementById('hidden');
  var audioSrc = ctx.createMediaElementSource(audio);
  var analyser = ctx.createAnalyser();

  // we have to connect the MediaElementSource with the analyser 
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);

  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
 
  // frequencyBinCount tells you how many values you'll receive from the analyser
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
 
var canvas = document.getElementById("oscilloscope");
var canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source

function draw() {

  drawVisual = requestAnimationFrame(draw);

  analyser.getByteFrequencyData(frequencyData);

  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / analyser.frequencyBinCount;
  var x = 0;

  for (var i = 0; i < analyser.frequencyBinCount; i++) {

    var v = frequencyData[i] / 128.0;
    var y = v * canvas.height / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
};
player.play()
draw();

}, false);
*/