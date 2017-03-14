"use strict";

var system;
var s;
var c;
var darkPurple = '#270227';

var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

var song, analyzer;

var bassLevelArr = [0, 0, 0, 0, 0];
var i = 0;

function preload(){
	soundFormats('ogg', 'mp3');
	song = loadSound('/assets/Shivainn-Master-1.mp3');
}

function setup(){
	c = createCanvas(winWidth, winHeight);
	c.parent("background-stars");
	system = new ParticleSystem(800, 10);
	song.loop(); 
	analyzer = new p5.Amplitude();
	analyzer.setInput(song);
}

function draw() {
	background(darkPurple);
	system.run();
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

	this.position = createVector(mouseX, mouseY);
	this.radius = this.radiusMax * (this.randomX + this.randomY) / 3.5;
	this.opacity = (this.randomX + this.randomY) / 2.5;
}

Particle.prototype.generateRandom = function(){
	this.randomX = random(1);
	this.randomY = random(1);
}

Particle.prototype.run = function(){
	this.update();
	this.display();
}

Particle.prototype.update = function(){
	var multiplier = analyzer.getLevel() * 10 + 1;
	this.position.add(this.velocity.copy().mult(multiplier));
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

ParticleSystem.prototype.run = function() {

	// for(var i = this.suns.length - 1; i >= 0; i--){
	// 	var s = this.suns[i];
	// 	s.run();
	//
	// 	if(s.isDead())
	// 		this.suns.splice(i, 1);
	// }

	for (var i = this.particles.length-1; i >= 0; i--) {

		var p = this.particles[i];
		p.run();

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
