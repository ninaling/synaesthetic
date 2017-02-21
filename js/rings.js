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

            geometry.verticesNeedUpdate = true;
            geometry.dynamic = true;

            // Remove center vertex
            geometry.vertices.shift();

            var orbitPath = new THREE.Line( geometry, material );

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

        noise = orbitPath.geometry.vertices.map(() => Math.random());
        rollwindow = 10;
        avg = noise.slice(0,rollwindow).reduce((acc, val) => acc+val, 0)*1.0/rollwindow;
        smoothnoise = noise.map((val, i) => {
            avg += noise[(i+rollwindow)%noise.length]*1.0/rollwindow;
            avg -= noise[i]*1.0/rollwindow;
            return avg;
        });

        //connect mic
        var aCtx;
        var analyser;
        var microphone;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio: true}, function(stream) {
                aCtx = new AudioContext();
                analyser = aCtx.createAnalyser();
                microphone = aCtx.createMediaStreamSource(stream);
                microphone.connect(analyser);
                // analyser.connect(aCtx.destination);
            }, function (error) { console.log(error); });
        };

        minVolume = 10000;
        maxVolume = -10000;

        console.log(orbitPath.geometry.vertices);

        var afterFirstRender = false;

        class RollingAverage {
            constructor(size) {
                this.size = size;
                this.vals = new Array(size).fill(0);
                this.index = 0;
                this.avg = 0;
            }
            next (val) {
                this.avg -= this.vals[this.index];
                this.vals[this.index] = val*1.0/this.size;
                this.avg += this.vals[this.index];
                this.index = (this.index+1)%this.size;
                return this.avg;
            }
        }

        var longRoller = new RollingAverage(10);

        var maxScale = 0;

        function render() {
            if (afterFirstRender) {
                // needs to be set after first render?
                orbitPath.geometry.verticesNeedUpdate = true;
            }

            (function () {
                if (analyser) {
                    FFTData = new Float32Array(analyser.frequencyBinCount);
                    analyser.getFloatFrequencyData(FFTData);
                    avgVolume = (FFTData.reduce((acc, val) => acc+val, 0))/FFTData.length;

                    if (avgVolume < -10000 || avgVolume > 10000) return;

                    var shortAvg = avgVolume; // shortRoller.next(avgVolume);
                    var longAvg = longRoller.next(avgVolume);

                    var scale = Math.max(shortAvg-longAvg, 0);
                    maxScale = Math.max(scale, maxScale);
                    var normalized = scale/maxScale;
                    for (var i = 0; i < smoothnoise.length; i++) {
                        orbitPath.geometry.vertices[i].setZ(normalized*smoothnoise[i]);
                    }
                }
            })();

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

            afterFirstRender = true;
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


























