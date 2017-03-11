
var RingAnimator = (function() {
    var webglEl = document.getElementById('webgl');

    THREE.ImageUtils.crossOrigin = '';

    var segmentsArr = [1,2,3,4,6,8,10,15,20];

    var width = window.innerWidth,
        height = window.innerHeight;
    var radius = 0.45,
        curSegment = segmentsArr.length - 1,
        rotation = 3;

    var hasOrbit = false;
    var scene, camera, renderer, isPlaying;
    var orbitPath, orbitIndex, noiseForPath, rollwindow, avg;
    var sphere, rings;
    var square;
    var segmentDir = -1;
    
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

    var cube;

    function init(micIn){

        initScene();
        initRingedPlanet(hasOrbit, segmentsArr[curSegment], new THREE.Euler(rotation, rotation, rotation), new THREE.Euler(rotation, rotation, rotation), new THREE.Vector3(1,1,1));

     //   cube = new Models.cube(1, '#62c2bc');
     //   initOrbitPath();
     //   orbitPath.add(cube.obj);
       // scene.add(orbitPath);

     //   var cube = Models.createCube(1, '#fff');
     //   scene.add(cube);

        webglEl.appendChild(renderer.domElement);
        peakDone = false;

        render(micIn, hasOrbit);
        afterFirstRender = false;

    }

    function initScene(){
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 1000);

        camera.position.z = 8;

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

    function initRingedPlanet(hasOrbit, segments, rotationSphere, rotationRing, scale){
        if(hasOrbit)
            initOrbitPath();

        sphere = Models.createSphere(radius, segments);
        sphere.rotation = rotationSphere;

        if(hasOrbit)
            orbitPath.add(sphere);
        else
            scene.add(sphere);
        
        rings = Models.createRings(radius, segments);
        rings.rotation.x = rotationRing.x;
        rings.rotation.y = rotationRing.y;
        rings.rotation.z = rotationRing.z;

        rings.scale.x = scale.x;
        rings.scale.y = scale.y;
        rings.scale.z = scale.z;

        sphere.add(rings);

        sphere.position.setZ(2);
    }


    function render(micIn) {

        if (!isPlaying) return;

        var amp = micIn.getAmplitude();
        var bass = micIn.getBass();
        var centroid = micIn.getCentroid();

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
            
            var tempIndex = curSegment + segmentDir;
            changePlanetSegments(sphere, radius, tempIndex);
            curSegment = tempIndex;

            if(curSegment >= segmentsArr.length - 1)
                segmentDir = -1;
            else if (curSegment <= 0)
                segmentDir = 1;

            peakDone = false;
            peakThrottle = 0;
        }

        //rotation and scale for planet
        var scaleFactor = 1 + bass/200;
        var rotationFactor = amp / 2560;

        rings.scale.x = scaleFactor;
        rings.scale.z = scaleFactor;
        
        rings.rotation.x += rotationFactor * 2;
        rings.rotation.y += rotationFactor * 3;

        sphere.rotation.x += rotationFactor * 2;
        sphere.rotation.y += rotationFactor * 3;

      //  cube.update(amp, bass, centroid);


        requestAnimationFrame(function(micIn){
            render(micIn);
        }.bind(null, micIn));

        renderer.render(scene, camera);
        afterFirstRender = true;
    }
    function changePlanetSegments(object, radius, segments){
        if(segments != curSegment){
            curSegment = segments;
            
            var rotationSphere = object.rotation;
            var rotationRing = object.children[0].rotation;
            var tempScale = object.children[0].scale;

            scene.remove(object);
            initRingedPlanet(false, segmentsArr[curSegment], rotationSphere, rotationRing, tempScale);
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



















