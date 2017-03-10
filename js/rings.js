
var RingAnimator = (function() {
    var webglEl = document.getElementById('webgl');

    THREE.ImageUtils.crossOrigin = '';

    var width = window.innerWidth,
        height = window.innerHeight;
    var radius = 0.45,
        currentSegment = 30,
        rotation = 5;

    var scene, camera, renderer, isPlaying;
    var orbitPath, orbitIndex, noiseForPath, rollwindow, avg;
    var sphere, sphereDirectionX, rings, controls;
    var square;

    var afterFirstRender, longRoller, maxScale = 0;

    var aCtx, analyser, microphone;
    var peakDone, peakThrottle = 0;

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

        isPlaying = true;

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

    function initRingedPlanet(hasOrbit, segments){
        if(hasOrbit)
            initOrbitPath();

        sphere = Models.createSphere(radius, segments);
        sphere.rotation.y = rotation;
        sphereDirectionX = 1;

        if(hasOrbit)
            orbitPath.add(sphere);
        else
            scene.add(sphere);
        
        rings = Models.createRings(radius, segments);
        rings.rotation.y = rotation;
        sphere.add(rings);

        rings.scale.x = 1.1;
        rings.scale.z = 1.1;
    }

    function init(micIn){

        initScene();

        hasOrbit = false;
        initRingedPlanet(hasOrbit, currentSegment);

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

        if (!isPlaying) return;

        controls.update();

        var amp = micIn.getAmplitude();
        var bass = micIn.getBass();
        var centroid = micIn.getCentroid();

        console.log('amp', amp);
        console.log('bass', bass);
        console.log('centroid', centroid);

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

        //change segments
        if(bass > 240)
            peakDone = true;

        peakThrottle++;

        if(peakDone && peakThrottle > 100){
            if(currentSegment == 30)
                changePlanetSegments(sphere, radius, 1);
            else
                changePlanetSegments(sphere, radius, 30);

            peakDone = false;
            peakThrottle = 0;
        }

        //rotation and scale for planet
        var scaleFactor = 1 + bass/256;
        var rotationFactor = amp / 2560;

        rings.scale.x = scaleFactor;
        rings.scale.z = scaleFactor;
        
        rings.rotation.x += rotationFactor * 2;
        rings.rotation.y += rotationFactor * 3;
        
        sphere.rotation.x += rotationFactor * 2;
        sphere.rotation.y += rotationFactor * 3;


        requestAnimationFrame(function(micIn){
            render(micIn);
        }.bind(null, micIn));

        renderer.render(scene, camera);
        afterFirstRender = true;
    }
    function changePlanetSegments(object, radius, segments){
        if(segments != currentSegment){
            currentSegment = segments;
            scene.remove(object);
            initRingedPlanet(false, segments);
        }
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



















