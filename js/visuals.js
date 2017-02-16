"use strict";

var system;
var s;

var darkPurple = '#270227';

var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

function setup(){
	createCanvas(winWidth, winHeight);
	system = new ParticleSystem(100, 10);
}

function draw() {
	background(darkPurple);
	system.run();
	system.addParticle();
}

var Particle = function(radius){

	console.log('init particle')

	//random generation
	this.generateRandom();

	//max properties
	this.velocityMax = 10;
	this.radiusMax = radius;

	//derived properties from random
	this.velocity = createVector(
						this.randomX * this.velocityMax * 2 - this.velocityMax,
						(this.randomY * this.velocityMax * 2 - this.velocityMax)/1 //divide by 3 to lessen y, particles moving out of screen 
					);

	console.log(this.velocity.x + ', ' + this.velocity.y);

	//this.velocityScalar = sqrt(sq(this.velocity.x) + sq(this.velocity.y));
	//this.position = this.velocity.x > 0 ? createVector(0, random(height)) : createVector(width, random(height))
	this.position = createVector(mouseX, mouseY);
	this.radius = this.radiusMax * (this.randomX + this.randomY) / 2;
	this.opacity = (this.randomX + this.randomY) / 2;
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
	this.position.add(this.velocity);
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

	if(this.suns.length < 2)
		this.suns.push(new Sun(400));
};

ParticleSystem.prototype.run = function() {

	for(var i = this.suns.length - 1; i >= 0; i--){
		var s = this.suns[i];
		s.run();

		if(s.isDead())
			this.suns.splice(i, 1);
	}

	for (var i = this.particles.length-1; i >= 0; i--) {

		var p = this.particles[i];
		p.run();

		if (p.isDead()){
			this.particles.splice(i, 1);
		}
	}
};

/*
Cool stuff to look at later:
http://jsfiddle.net/juansrx/orb3kmjk/
http://jsfiddle.net/juansrx/myv5kg9t/
http://jsfiddle.net/juansrx/namq3has/
http://jsfiddle.net/juansrx/pnokeavu/
https://codepen.io/dissimulate/pen/fhjvk

*/

//stuff I gave up on
/*

Particle.prototype.display = function () {

	//tail of asteroid
	//length is proportional to velocity
	beginShape();
	strokeWeight(this.radius);
	stroke('rgba(47, 254, 225, ' + this.opacity + ')');
	vertex(this.position.x, this.position.y);
	vertex(this.position.x - this.velocity.x * this.velocityScalar * 20, this.position.y - this.velocity.y * this.velocityScalar * 20);
	endShape(CLOSE);

	beginShape();
	strokeWeight(this.radius * 0.9);
	stroke(purple);
	vertex(this.position.x - this.velocity.x * this.velocityScalar * 5, this.position.y - this.velocity.y * this.velocityScalar * 5);
	vertex(this.position.x, this.position.y);
	endShape(CLOSE);

	//head of asteroid
	stroke(purple);
	strokeWeight(this.radius * 0.1);
	fill('rgb(252,41,125)');
	ellipse(this.position.x, this.position.y, this.radius * 0.8, this.radius * 0.8);

	//this.drawTail('rgb(0,0,0)', 0.2, [4, 3, 2, 1, 2, 5, 3], 0);
	//this.drawTail(purple, 0.45, [3, 2, 1, 2], this.velocityScalar * 20);
	//this.drawTail('rgba(47, 254, 225)', 0.45, [3, 2, 1, 2], this.velocityScalar * 20 + this.radius/2);
};

Particle.prototype.drawTail = function(color, thickness, trailStagger, lengthFromHead){

	var stagger = - (trailStagger.length - 1)/2 * thickness;

	for(var i = 0; i < 1; i++){

		stroke(color);
		strokeWeight(thickness * this.radius/2);

		push();

		beginShape();

		var rad = radians(45);
		translate(width/3, -370);
		rotate(rad);

		//tail
		vertex(this.position.x - this.velocity.x * this.velocityScalar * trailStagger[i], 
			   this.radius/2 * stagger + this.position.y);

		//head
		vertex(this.position.x,
			   this.radius/2 * stagger + this.position.y);

		endShape(CLOSE);

		pop();
		stagger += thickness;
	}
}

function drawCurves(){
	background(0);
	noFill();
	beginShape();
	stroke(255);
	curveVertex(84,  91);
	curveVertex(84,  91);
	curveVertex(68,  19);
	curveVertex(21,  17);
	curveVertex(32, 100);
	curveVertex(32, 100);
	endShape();

	//background (255, 255, 255);
	smooth();
	//fill(142, 199, 242);
	//arc(150, 150, 300, 300, 0, PI/2);
	translate(-50, 0);
	arc(150, 150, 300, 300, radians(180), radians(360));
}

*/

