var player;
var analyser;
var frequencyData;
var sliceWidth;

function youtubeAudio(link){
  this.player = new window.Audio('www.youtube.com/watch?v=S-sJp1FfG7Q');
  this.player.preload = 'metadata';
  this.player.setAttribute("id", "audioPlayer");
  this.player.controls = true;
  document.body.appendChild(this.player);

  this.audioCtx = new AudioContext();
  this.audio = document.getElementById('audioPlayer');
  this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);

  this.analyser = this.audioCtx.createAnalyser();
  this.audioSrc.connect(this.analyser);
  this.audioSrc.connect(this.audioCtx.destination);

  this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  this.sliceWidth = 600 / analyser.frequencyBinCount; //600 hardcoded for now
}

function setup(){
  player = new window.Audio('www.youtube.com/watch?v=S-sJp1FfG7Q')
  player.preload = 'metadata'
  player.setAttribute("id", "myAudio");
  player.controls = true;
  document.body.appendChild(player);

  var ctx = new AudioContext();
  var audio = document.getElementById('myAudio');
  var audioSrc = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);
  frequencyData = new Uint8Array(analyser.frequencyBinCount);
  sliceWidth = 600 * 1.0 / analyser.frequencyBinCount;
  player.play();
  createCanvas(600,600);
}

function draw(){
  background(0);
  analyser.getByteFrequencyData(frequencyData);
  noFill();
  beginShape();
  stroke(255,255,255);
  var x = 0;
  var y = 0;
  for (var i = 0; i < analyser.frequencyBinCount; i++) {
    var v = frequencyData[i] / 128.0;
    var y = v * 600 / 2;

    vertex(x, y);

    x += sliceWidth;
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