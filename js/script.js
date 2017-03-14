
var c;

var system;
var s;

var darkPurple = '#270227';

var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

var mic;
var fft;

var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

function preload(){
	var ytLink = window.location.href.replace(/.*\//g, "youtube.com/");
	var linkIndex = ytLink.indexOf('watch?v=');
	var watchStr = ytLink.substr(linkIndex+8);
	var url1 = ("https://www.googleapis.com/youtube/v3/videos?id=" +
	 watchStr + "&key=AIzaSyA8Qk6dVeO2sGMH2cX5ujy5z6Xii3wTv5U&part=contentDetails")
	$.ajax({
	    async: true,
	    type: 'GET',
	    url: url1,
	    success: function(data) {
	        if (data.items.length > 0) {
	            duration = convert_time(data.items[0].contentDetails.duration)
	            mic = new youtubeAudio(ytLink, duration);
				mic.play();
				loop();
	        }
	    }
	});
}

function setup(){
	c = createCanvas(winWidth, winHeight);
	c.parent("background-stars");
	system = new ParticleSystem(400, 15);

	if(RingAnimator.checkCompatible())
		RingAnimator.init(mic);
	noLoop();
}

function draw() {
	background(darkPurple);
  c.size(window.innerWidth, window.innerHeight);
	updateProgressBar();
	var spectrum = mic.FFT();
	var bassLevel = mic.getBass();

	var bassLevelMultiplier = bassLevel > 200
								? (bassLevel - 95)/8
								: bassLevel == 0
									? 0
									: 1;
	var props = {
		bassLevelMultiplier: bassLevelMultiplier
	};

	system.run(props);
	applyColorFilter(bassLevel);
	system.addParticle();

}

function updateProgressBar(){
	//get current %
	var position = mic.currentTime();
	//draw from left to % of screen in bottom 10px
	push();
	colorMode(RGB);
	strokeWeight(10);
	stroke(255);
	line(0, height-5, position*width, height-5);
	pop();
}

function mouseClicked(){
	console.log (mouseX / width);
	if(mouseY > height-10){
		mic.seek(mouseX*100 / width);
	}
}

var Particle = function(radius){

	//max properties
	this.velocityMax = 10;
	this.radiusMax = radius;

	//random generation
	this.generateRandom();

	//derived properties from random
	this.velocity = createVector(
						(this.randomX * this.velocityMax * 1.4 - this.velocityMax * 0.85)/5,
						(this.randomY * this.velocityMax * 1.4 - this.velocityMax * 0.85)/10 //divide by 3 to lessen y particles moving out of screen
					);

	//random generation again so large particles aren't all in southeast direction
	this.generateRandom();

	this.position = createVector(winWidth/2, winHeight/2);
	this.radius = this.radiusMax * (this.randomX + this.randomY) / 3.5;
	this.opacity = (this.randomX + this.randomY) / 2.5;
}

Particle.prototype.generateRandom = function(){
	this.randomX = random(1);
	this.randomY = random(1);
}

Particle.prototype.run = function(bassLevelMultiplier){
	this.update(bassLevelMultiplier);
	this.display();
}

Particle.prototype.update = function(bassLevelMultiplier){
	var tempVector = this.velocity.copy().mult(bassLevelMultiplier);
	this.position.add(tempVector);
}

Particle.prototype.display = function(){
	fill('rgba(253, 102, 96, ' + this.opacity + ')');
	strokeWeight(0);
	ellipse(this.position.x, this.position.y, this.radius, this.radius);
}

Particle.prototype.isDead = function(){
	var radius = this.radius;

	return 	this.position.x < -radius ||
			this.position.y < -radius ||
			this.position.x > winWidth + radius ||
			this.position.y > winHeight + radius;
};

var ParticleSystem = function(maxNum, size) {
	this.particles = [];
	this.suns = [];
	this.maxParticles = maxNum;
	this.particlesSize = size;
};

ParticleSystem.prototype.addParticle = function() {
	if(this.particles.length < this.maxParticles)
		this.particles.push(new Particle(this.particlesSize));
};

ParticleSystem.prototype.run = function(props) {
	for (var i = this.particles.length-1; i >= 0; i--) {

		var p = this.particles[i];
		p.run(props.bassLevelMultiplier);

		if (p.isDead()){
			this.particles.splice(i, 1);
		}
	}
};

function getMean(arr, n) {
  var sum = 0;
  for (var k = 0; k < n; k++) sum += arr[k];
  return sum / n;
}

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    var h = Math.floor(duration / 3600);
    var m = Math.floor(duration % 3600 / 60);
    var s = Math.floor(duration % 3600 % 60);
    //return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    return h*3600 + m*60 + s;
}

// var player;
// var fftbins;
//
// function setup(){
//   var x = window.location.href;
//   console.log(x.replace(/localhost[^\/]*\//, "www.youtube.com/"));
//   audio = new youtubeAudio(x.replace(/http:\/\/localhost[^\/]*\//, "www.youtube.com/"));
//   audio.play();
//   createCanvas(600,600);
// }
//
// function draw(){
//   background(0);
//   fftbins = audio.FFT();
//   console.log(audio.getBass());
//   noFill();
//   beginShape();
//   stroke(255,255,255);
//   var x = 0;
//   var y = 0;
//   for (var i = 0; i < fftbins.length; i++) {
//     var v = fftbins[i] / 128.0;
//     var y = v * 600 / 2;
//
//     vertex(x, y);
//
//     x += width/fftbins.length;
//   }
//   endShape();
// }
