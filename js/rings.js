/*"use strict";

var darkPurple = '#270227';

var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

var planet;

function setup(){
	createCanvas(winWidth, winHeight);
	planet = new Planet(true, 100);
}

function draw(){
	background(darkPurple);
	planet.run();
}

var Planet = function(hasRing, radius){

	this.radius = radius;
	this.hasRing = hasRing;
	this.position = createVector(width/2, height/2);

	if(this.hasRing)
	{

	}

}

Planet.prototype.run = function(){
	this.update();
	this.display();
}

Planet.prototype.update = function(){

}

Planet.prototype.display = function(){
	fill('rgba(253, 102, 96)');
	strokeWeight(0);
	ellipse(this.position.x, this.position.y, this.radius, this.radius);
}


*/

$(document).on('ready', function() {
	(function() {

		var webglEl = document.getElementById('webgl');
		if (!Detector.webgl) {
			Detector.addGetWebGLMessage(webglEl);
			return;
		} 

        THREE.ImageUtils.crossOrigin = '';
        var width = window.innerWidth,
            height = window.innerHeight;
        var radius = 0.45,
        	segments = 32,
        	rotation = 5;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 1000);

        camera.position.z = 3;
        camera.position.y = 2;
        camera.position.x = 2;

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);

        var sphere = createSphere(radius, segments);
        sphere.rotation.y = rotation;
        scene.add(sphere);

        var rings = createRings(radius, segments);
        rings.rotation.y = rotation;
        scene.add(rings);

        var controls = new THREE.TrackballControls(camera);
        webglEl.appendChild(renderer.domElement);

        render();

        function render() {
        	controls.update();
        	//sphere.rotation.y += 0.05;
        	//rings.rotation.y += 0.02;
        	requestAnimationFrame(render);
        	renderer.render(scene, camera);
        }
        function createSphere(radius, segments) {
        	return new THREE.Mesh(
        		new THREE.SphereGeometry(radius, segments, segments),
        		new THREE.MeshBasicMaterial(
        			{
        				color: '#ed4c51'
        			}
        		)
        	);
        }
        function createRings(radius, segments) {
        	return 	new THREE.Mesh(new THREE.XRingGeometry(1.2 * radius, 2 * radius, 2 * segments, 5, 0, Math.PI * 2),
        			new THREE.MeshBasicMaterial(
        				{	
        					color: '#f8de5c',
        					side: THREE.DoubleSide, transparent: true, opacity: 0.6 
        				}
        			)
        		);
        }

	}());
});


























