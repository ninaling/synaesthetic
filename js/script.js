
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

var triggerBack = true;
var triggerBackCount = 0;
var triggerStars = true;
var triggerStarsCount = 0;
var triggerStarsFlicker = 5;

//var colorizeBackground = triggerWithThrottle(30, applyColorFilterBackground, applyColorFilterInvert, disableColorFilterInvert);
//var colorizeStars = triggerWithThrottle(30, applyColorFilterStars, null, null);

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
				if(GalaxyAnimator.checkCompatible())
					GalaxyAnimator.init(mic);
				loop();
	        }
	    }
	});
}

function setup(){
	c = createCanvas(winWidth, winHeight);
	c.parent("background-stars");
	system = new ParticleSystem(400, 15);
}

function draw() {
    c.size(window.innerWidth, window.innerHeight);

	var spectrum = mic.FFT();
	var bassLevel = mic.getBass();
	var trebleLevel = mic.getTreble();

	var bassLevelMultiplier = bassLevel > 200
								? (bassLevel - 95)/8
								: bassLevel == 0
									? 0
									: 1;

	var trebleLevelMultiplier = trebleLevel > 60
								? (trebleLevel - 20)/4
								: trebleLevel == 0
									? 0
									: 1;

	var props = {
		bassLevelMultiplier: bassLevelMultiplier,
		trebleLevelMultiplier: trebleLevelMultiplier
	};

	background(darkPurple);
	updateProgressBar();
	system.run(props);

	var invert = Math.floor(Math.random() * 10);
    //colorizeBackground(bassLevel, invert);
    //colorizeStars(bassLevel, invert);

	//Triggers the background color change on base
	if(triggerBack && applyColorFilterBackground(bassLevel, invert)){
		triggerBack = false;
		triggerBackCount = 30;
	} else if (!triggerBack) {
		triggerBackCount--;
		if(triggerBackCount == 0){
	    applyColorFilterBackground(0, 0);
	    triggerBack = true;
		}
	}

	if(triggerStars && applyColorFilterStars(bassLevel, invert)){
		triggerStars = false;
		triggerStarsCount = 30;
	} else if (!triggerStars) {
		triggerStarsCount--;
		if(triggerStarsCount == 0){
		    applyColorFilterStars(0, 0);
		    triggerStars = true;
		}
	}

    system.addParticle();
}
/*
function triggerWithThrottle(threshold, callback, callback2, reset){

	var trigger = true;
	var curCount = 0;

	return function(bassLevel, invert){
		if(trigger && callback(bassLevel)){
			if(callback2 != null){
				console.log(callback2)
				callback2(bassLevel, invert);
				console.log('inverting')
			}
			trigger = false;
			curCount = threshold;
		}
		else if(!trigger){
			if(reset != null)
				reset();
			curCount--;
			if(curCount <= 0){
				callback(0);
				trigger = true;
			}
		}
	}

};*/

var Color = function(r,g,b){
	this.r = r;
	this.g = g;
	this.b = b;
	this.opacity = 1;
}

Color.prototype.setOpacity = function(opacity){
	this.opacity = opacity;
}

Color.prototype.toString = function(){
	return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.opacity + ')';
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
	if(mouseY > height-10){
		mic.seek(mouseX*100 / width);
	}
}

var Particle = function(radius){

	//max properties
	this.velocityMax = 10;
	this.radiusMax 	 = radius;

	//random generation
	this.generateRandom();

	//derived properties from random
	this.velocity = createVector(
							(this.randomX * this.velocityMax * 1.4 - this.velocityMax * 0.72)/5,
							(this.randomY * this.velocityMax * 1.4 - this.velocityMax * 0.72)/8
						);

	//random generation again so large particles aren't all in southeast direction
	this.generateRandom();

	this.position 	 = createVector(winWidth/2, winHeight/2);
	this.radius 	 = this.radiusMax * (this.randomX + this.randomY) / 3.5;
	this.opacity 	 = (this.randomX + this.randomY) / 2.5;
	this.color.setOpacity(this.opacity);
}

Particle.prototype.generateRandom = function(){
	this.randomX 	 = random(1);
	this.randomY 	 = random(1);

	var colors = [new Color(253, 102, 96), new Color(98, 194, 188)]

	if(Math.random() > 0.3)
	{
		this.type = 0;
		this.color = colors[this.type];
	}
	else
	{
		this.type = 1;
		this.color = colors[this.type];
	}
}

Particle.prototype.run = function(props){
	var mult = this.type == 0 ? props.bassLevelMultiplier : props.trebleLevelMultiplier;
	this.update(mult);
	this.display();
}

Particle.prototype.update = function(multiplier){
	var tempVector = this.velocity.copy().mult(multiplier);
	this.position.add(tempVector);
}

Particle.prototype.display = function(){
	fill(this.color.toString());
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
		p.run(props);

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
