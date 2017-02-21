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

        camera.position.z = 5;
        camera.position.y = 2;

        var renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);
        renderer.setClearColor( 0x000000, 0 ); // the default

        orbitPath = (function createOrbitPath () {
            var radius = 2,
            segments = 256,
            material = new THREE.LineBasicMaterial( { color: 0xffffff } ),
            geometry = new THREE.CircleGeometry( radius, segments );

            // Remove center vertex
            geometry.vertices.shift();

            orbitPath = new THREE.Line( geometry, material );

            orbitPath.rotation.x = Math.PI/2;

            scene.add(orbitPath);
            return orbitPath;
        })();

        orbitIndex = 0;

        var sphere = createSphere(radius, segments);
        sphere.rotation.y = rotation;
        orbitPath.add(sphere);

        var rings = createRings(radius, segments);
        rings.rotation.y = rotation;
        sphere.add(rings);

      //  var background = createBackground(90, 64);
      //  scene.add(background);

        var controls = new THREE.TrackballControls(camera);
        webglEl.appendChild(renderer.domElement);

        render();

        window.addEventListener('resize', function() {
		    var WIDTH = window.innerWidth,
		        HEIGHT = window.innerHeight;
		    renderer.setSize(WIDTH, HEIGHT);
		    camera.aspect = WIDTH / HEIGHT;
		    camera.updateProjectionMatrix();
		});

        function render() {
        	controls.update();
        	rings.rotation.y += 0.05;
        	rings.rotation.x += 0.05;
        	
        	sphere.rotation.x += 0.02;
        	sphere.rotation.y += 0.05;

            orbitIndex = (orbitIndex+1) % orbitPath.geometry.vertices.length;
            var newpos = orbitPath.geometry.vertices[orbitIndex];
            sphere.position.set(newpos.x, newpos.y, newpos.z);

        	requestAnimationFrame(render);
        	renderer.render(scene, camera);
        }
        function createSphere(radius, segments) {
        	return new THREE.Mesh(
        		new THREE.SphereGeometry(radius, segments, segments),
        		new THREE.MeshBasicMaterial(
        			{
        				color: '#ed4c51',
        				wireframe: true
        			}
        		)
        	);
        }
        function createRings(radius, segments) {
        	return 	new THREE.Mesh(new THREE.XRingGeometry(1.2 * radius, 2 * radius, 2 * segments, 5, 0, Math.PI * 2),
        			new THREE.MeshBasicMaterial(
        				{	
        					color: '#f8de5c',
        					wireframe: true,
        					side: THREE.DoubleSide, transparent: true, opacity: 0.9
        				}
        			)
        		);
        }

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


























