"use strict";

var system;
var s;

var darkPurple = '#270227';

var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

var mic;
var fft;

var bassLevelArr = [0, 0, 0, 0, 0];
var i = 0;

function preload(){
	mic = loadSound('../assets/pluto.mp3');
}

function setup(){
	createCanvas(winWidth, winHeight);
	system = new ParticleSystem(400, 10);

	//sound stuff
	// mic = new p5.AudioIn();
  // mic.start();
	mic.play();

  fft = new p5.FFT();
  // fft.setInput(mic);
}

function draw() {

	var micLevel = mic.getLevel();
	var spectrum = fft.analyze();
	var bassLevel = fft.getEnergy("bass");
	// bassLevelArr[i] = bassLevel > 230 ? (bassLevel - 110)/8 : 1;
	console.log(bassLevel);
  // if (i == 5) i = 0;
  // else i++;

	// var bassLevelMultiplierRolling = getMean(bassLevelArr, 5);

	var bassLevelMultiplierRolling = bassLevel > 230 ? (bassLevel - 110)/8 : 1;
	var props = {
		bassLevelMultiplier: bassLevelMultiplierRolling
	};

	background(darkPurple);
	system.run(props);
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
						(this.randomX * this.velocityMax * 1.4 - this.velocityMax * 0.85)/10,
						(this.randomY * this.velocityMax * 1.4 - this.velocityMax * 0.85)/20 //divide by 3 to lessen y particles moving out of screen
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

/*
* Sun is a subclass of Particle
*/

var Sun = function(radius){
	Particle.call(this, radius);
	this.position = this.velocity.x > 0 ? createVector(0, random(height)) : createVector(width, random(height));
	this.velocity.x /= 2;
	this.velocity.y /= 4;
}

Sun.prototype = Object.create(Particle.prototype);
Sun.prototype.constructor = Particle;

Sun.prototype.display = function(){

	fill('#2c102e');
	ellipse(this.position.x, this.position.y, this.radius, this.radius);

	fill('#6d070f');
	ellipse(this.position.x, this.position.y, this.radius * 0.9, this.radius * 0.9);

	fill('#ac373b');
	ellipse(this.position.x, this.position.y, this.radius * 0.8, this.radius * 0.8);

	fill('#fde158');
	ellipse(this.position.x, this.position.y, this.radius * 0.7, this.radius * 0.7);

}

var ParticleSystem = function(maxNum, size) {
	this.particles = [];
	this.suns = [];
	this.maxParticles = maxNum;
	this.particlesSize = size;
};

ParticleSystem.prototype.addParticle = function() {
	if(this.particles.length < this.maxParticles)
		this.particles.push(new Particle(this.particlesSize));

	// if(this.suns.length < 2)
	// 	this.suns.push(new Sun(400));
};

ParticleSystem.prototype.run = function(props) {

	// for(var i = this.suns.length - 1; i >= 0; i--){
	// 	var s = this.suns[i];
	// 	s.run();
	//
	// 	if(s.isDead())
	// 		this.suns.splice(i, 1);
	// }

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
