//console.log('mic', mic);

var RingAnimator = (function() {
	var webglEl = document.getElementById('webgl');

    THREE.ImageUtils.crossOrigin = '';

    var width = window.innerWidth,
        height = window.innerHeight;
    var radius = 0.45,
    	segments = 30,
    	rotation = 5;

    var scene, camera, renderer;
    var orbitPath, orbitIndex, noiseForPath, rollwindow, avg;
    var sphere, sphereDirectionX, rings, controls;
    var square;

    var afterFirstRender, longRoller, maxScale = 0;

    var minVolume = 10000,
        maxVolume = -10000;

    var aCtx, analyser, microphone;
    var peakDone, peakDuration = 0;

    function checkCompatible(){
        if (!Detector.webgl) {
            Detector.addGetWebGLMessage(webglEl);
            return false;
        }
        return true;
    }

    function initScene(){
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 1000);

        camera.position.z = 5;
        camera.position.y = 2;

        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);
        renderer.setClearColor( 0x000000, 0 ); // the default
    }

    function initOrbitPath(){
        orbitPath = (function createOrbitPath () {
            var radius = 2,
                segments = 256,
                material = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.2 } ),
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

        noiseForPath = orbitPath.geometry.vertices.map(() => Math.random());
        rollwindow = 10;
        avg = noiseForPath.slice(0,rollwindow).reduce((acc, val) => acc+val, 0)*1.0/rollwindow;
        smoothnoise = noiseForPath.map((val, i) => {
            avg += noiseForPath[(i+rollwindow)%noiseForPath.length]*1.0/rollwindow;
            avg -= noiseForPath[i]*1.0/rollwindow;
            return avg;
        });

        orbitIndex = 0;
    }

    function initRingedPlanet(hasOrbit){
        if(hasOrbit)
            initOrbitPath();

        sphere = createSphere(radius, segments);
        sphere.rotation.y = rotation;
        sphereDirectionX = 1;

        if(hasOrbit)
            orbitPath.add(sphere);
        else
            scene.add(sphere);
        
        rings = createRings(radius, segments);
        rings.rotation.y = rotation;
        sphere.add(rings);

        rings.scale.x = 1.1;
        rings.scale.z = 1.1;
    }

    function init(micIn){

        initScene();

        hasOrbit = false;
        initRingedPlanet(hasOrbit);

        controls = new THREE.TrackballControls(camera);
        controls.enabled = false;

        webglEl.appendChild(renderer.domElement);
        
        peakDone = false;
        render(micIn, hasOrbit);
        afterFirstRender = false;
    }

    function enableDoubleShadow(amp){
        camera.position.x += amp / 256 * 2 * sphereDirectionX;

        if(amp > 150 || camera.position.x < 200 || camera.position.x > -200)
            sphereDirectionX *= -1;
    }

    function render(micIn) {

        var amp = micIn.getAmplitude();

        if(hasOrbit){
            if (afterFirstRender)
                orbitPath.geometry.verticesNeedUpdate = true;

            (function () {
                if (typeof micIn != 'undefined' && micIn.analyser) {
                    for (var i = 0; i < smoothnoise.length; i++) {
                        //getBass()
                        orbitPath.geometry.vertices[i].setZ(smoothnoise[i] * micIn.getAmplitude() / 100);
                        //orbitPath.geometry.vertices[i].setX(smoothnoise[i] * micIn.getAmplitude() / 100);
                        //orbitPath.geometry.vertices[i].setY(smoothnoise[i] * micIn.getAmplitude() / 100);
                    }
                }
                orbitIndex = (orbitIndex+1) % orbitPath.geometry.vertices.length;
                var newpos = orbitPath.geometry.vertices[orbitIndex];
                sphere.position.set(newpos.x, newpos.y, newpos.z);
            })();
        }

    	controls.update();

        //this does jank double shadow effect
        if(amp > 100)
            peakDone = true;

        if(peakDone){
            enableDoubleShadow(amp);
            peakDuration++;

            if(peakDuration > 100){
                peakDuration = 0;
                peakDone = false;
            }
        }

        if(amp > 100 && rings.scale.x < 1.5)
        {
            sphere.scale.x += amp / 2560;
            sphere.scale.y += amp / 2560;
            sphere.scale.z += amp / 2560;
            rings.scale.x += 0.01;
            rings.scale.z += 0.01;
        }
        else if (amp > 80 && rings.scale.x < 1.3)
        {
            sphere.scale.x += amp / 2560 / 2;
            sphere.scale.y += amp / 2560 / 2;
            sphere.scale.z += amp / 2560 / 2;
            rings.scale.x += 0.01 / 2;
            rings.scale.z += 0.01 / 2;
        }
        else if (amp < 100 && rings.scale.x > 1)
        {
            sphere.scale.x -= amp / 2560;
            sphere.scale.y -= amp / 2560;
            sphere.scale.z -= amp / 2560;
            rings.scale.x -= 0.01;
            rings.scale.z -= 0.01;
        }

        
        rings.rotation.y += amp / 2560 * 3; //0.05;
        rings.rotation.x += amp / 2560 * 2;

        sphere.rotation.x += amp / 2560 * 2;
        sphere.rotation.y += amp / 2560 * 3;


    	requestAnimationFrame(function(micIn){
            render(micIn);
        }.bind(null, micIn));

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
    function createCube(length){
        var material = new THREE.MeshBasicMaterial( {
            color: '#000',
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1
        } );

        var mesh = new THREE.Mesh(
            new THREE.CubeGeometry(length,length,length),
            material
        )

        //wireframe
      /*  var geo = new THREE.WireframeGeometry( mesh.geometry );
        var mat = new THREE.LineBasicMaterial( { color: '#fff', linewidth: 2 } );
        var wireframe = new THREE.Line( geo, mat );
        mesh.add( wireframe );*/

        return mesh;
    }
    function createRings(radius, segments) {
    	return 	new THREE.Mesh(new THREE.XRingGeometry(1.2 * radius, 2 * radius, 2 * segments, 5, 0, Math.PI * 2),
    			new THREE.MeshBasicMaterial(
    				{	
    					color: '#f8de5c',
    					wireframe: false,
    					side: THREE.DoubleSide, transparent: true, opacity: 0.9
    				}
    			)
    		);
    }

    return {
        checkCompatible: checkCompatible,
        init: init
    }

    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();

    });

}());



















