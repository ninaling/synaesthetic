
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

function setup(){
	c = createCanvas(winWidth, winHeight);
	c.parent("background-stars");
	system = new ParticleSystem(400, 15);

    mic = new youtubeAudio(window.location.href.replace(/http:\/\/localhost[^\/]*\//, "www.youtube.com/"));
	mic.play();

	if(RingAnimator.checkCompatible())
		RingAnimator.init(mic);

}

function draw() {
  c.size(window.innerWidth, window.innerHeight);

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

	background(darkPurple);
	system.run(props);
    applyColorFilterStars(bassLevel);
    applyColorFilterBackground(bassLevel);
	//setTimeout(function(){
    //    applyColorFilter(bassLevel);//Call every 5 seconds after being called 
    //    console.log('setTimeout');
    //}, 5000);
    system.addParticle();
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

function debounce(func, wait, immediate){
    var timeout;
    return function(){
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

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
