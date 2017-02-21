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

		var width = window.innerWidth,
	        height = window.innerHeight;
	    var radius = 0.45,
	       	segments = 30,
	        rotation = 5;
	    var isWireFrame = true;
	    var scene, camera, controls, renderer;
	    var sphere, rings;

		init();

		function init(){
			var webglEl = document.getElementById('webgl');

			if (!Detector.webgl) {
				Detector.addGetWebGLMessage(webglEl);
				return;
			} 

	        THREE.ImageUtils.crossOrigin = '';

	        scene = new THREE.Scene();
	        camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 1000);

	        camera.position.z = 3;
	        camera.position.y = 2;
	        camera.position.x = 2;

	        renderer = new THREE.WebGLRenderer({ alpha: true });
	        renderer.setSize(width, height);
	        renderer.setClearColor( 0x000000, 0 ); // the default

	        sphere = createSphere(radius, segments);
	        sphere.rotation.y = rotation;
	        scene.add(sphere);

	        rings = createRings(radius, segments);
	        rings.rotation.y = rotation;
	        scene.add(rings);

	      //  var background = createBackground(90, 64);
	      //  scene.add(background);

	        controls = new THREE.TrackballControls(camera);
	        webglEl.appendChild(renderer.domElement);

	        render();
	        
		}
		var first = true;
        function render() {

        	if(first){
        		controls.update();
        		//disables mouse control
        		//first = false;
        	}
        	rings.rotation.y += 0.05;
        	rings.rotation.x += 0.05;
        	//rings.rotation.z += 0.05;

 			//sphere = createSphere(radius, segments++);
        	
        	sphere.rotation.x += 0.02;
        	sphere.rotation.y += 0.05;

        	requestAnimationFrame(render);
        	renderer.render(scene, camera);

        	//update(new THREE.Vector3(0.01, 0.01, 0.01));
        }

        function update(dir){
        	sphere.position.x += dir.x;
        	rings.position.x += dir.x;

        	sphere.position.y += dir.y;
        	rings.position.y += dir.y;

        	sphere.position.z += dir.z;
        	rings.position.z += dir.z;
        }

        function createSphere(radius, segments) {
        	return new THREE.Mesh(
        		new THREE.SphereGeometry(radius, segments, segments),
        		new THREE.MeshBasicMaterial(
        			{
        				color: '#ed4c51',
        				wireframe: isWireFrame
        			}
        		)
        	);
        }
        function createRings(radius, segments) {
        	return new THREE.Mesh(
        		new THREE.XRingGeometry(1.2 * radius, 2 * radius, 2 * segments, 5, 0, Math.PI * 2),
        		new THREE.MeshBasicMaterial(
        			{	
        				color: '#f8de5c',
        				wireframe: isWireFrame,
        				side: THREE.DoubleSide, transparent: true, opacity: 0.9
        			}
        		)
        	);
        }

        window.addEventListener('resize', function() {
		    var WIDTH = window.innerWidth,
		        HEIGHT = window.innerHeight;
		    renderer.setSize(WIDTH, HEIGHT);
		    camera.aspect = WIDTH / HEIGHT;
		    camera.updateProjectionMatrix();
		});

       /* function createBackground(radius, segments) {
        	return new THREE.Mesh(
        		new THREE.SphereGeometry(radius, segments, segments),
        		new THREE.MeshBasicMaterial(
        			{
        				//map: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/bubblin/The-Solar-System/master/images/shared/galaxy_starfield.jpg'),
        				color: 'rgb(255,0,0)',
        				side: THREE.BackSide, transparent: true, opacity: 0
        			})
        		); 
        } */

	}());
});


























