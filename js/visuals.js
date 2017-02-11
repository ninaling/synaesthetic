"use strict";

var system;
var sunOutline;

function setup(){
	createCanvas(window.innerWidth, window.innerHeight);
	system = new ParticleSystem();
}

function draw() {
	background(0);

	system.run();
	system.addParticle();
}

var Particle = function(position, radius){
	//this.acceleration = createVector(0, 0.05);
	this.velocity = p5.Vector.random2D();
	this.position = position.copy();
	this.proximity = radius;
	this.lifespan = 200;
	this.decay = 1;
}

Particle.prototype.run = function(){
	this.update();
	this.display();
}

Particle.prototype.update = function(){
	//this.velocity.add(this.acceleration);
	this.position.add(this.velocity);
	this.lifespan -= this.decay;
}

Particle.prototype.display = function () {
	stroke(255, this.lifespan);
	strokeWeight(2);
	fill(0,this.lifespan/200);
	ellipse(this.position.x, this.position.y, this.proximity, this.proximity);
};

Particle.prototype.isDead = function(){
	return this.lifespan < 0;
};

var ParticleSystem = function() {
	this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
	if(mouseX != 0 && mouseY != 0){
		//this.particles.push(new Particle(createVector(mouseX, mouseY), 20));
	}
	this.particles.push(new Particle(createVector(width/2, height/2), 100));
};

ParticleSystem.prototype.run = function() {
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

