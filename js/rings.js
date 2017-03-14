
var GalaxyAnimator = (function() {

    var webglEl = document.getElementById('webgl');

    THREE.ImageUtils.crossOrigin = '';

    var width = window.innerWidth,
        height = window.innerHeight;

    var segmentsArr = [1,2,3,4,6,8,10,15,20]; 
    var radius = 0.45,
        curSegmentIndex = segmentsArr.length - 1,
        rotation = 3;

    var scene, camera, renderer, isPlaying;

    var planet, orbitPath;

    var segmentDir = -1;
    
    var afterFirstRender;
    var peakDone, peakThrottle = 0;

    function checkCompatible(){
        if (!Detector.webgl) {
            Detector.addGetWebGLMessage(webglEl);
            return false;
        }
        return true;
    }

    function init(micIn){

        initScene();
        initAllObjects();

        webglEl.appendChild(renderer.domElement);
        peakDone = false;

        render(micIn);
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

    function initAllObjects(){

        planet = new GalaxyModels.planet({
                    radius: radius,
                    segments: segmentsArr[curSegmentIndex],
                    color: '#ed4c51',
                    ringColor: '#f8de5c'
                }, rotation);

        scene.add(planet.obj);

        orbitPath = new GalaxyModels.orbit({
                        radius: 4,
                        segments: 500,
                        color: '#ffffff',
                        spacing: 22,
                        rotation: 0,
                        speed: 2       //must be an integer value
                    }, false);

        for(var i = 0; i < 22; i++)
        {
            var cube = new GalaxyModels.cube(0.1 * Math.random(), '#62c2bc');
            orbitPath.add(cube);
        }

        scene.add(orbitPath.obj);
    }

    function render(micIn) {

        if (!isPlaying) return;

        var mic = {
            amp: micIn.getAmplitude(),
            bass: micIn.getBass(),
            treble: micIn.getTreble(),
            centroid: micIn.getCentroid()
        }

        handlePeak(mic.bass, null);

        orbitPath.update({
                            breakpoints: [160, 220],
                            speeds: [1,4,6]

                         }, mic, afterFirstRender);

        planet.update(mic);

        requestAnimationFrame(function(micIn){
            render(micIn);
        }.bind(null, micIn));

        renderer.render(scene, camera);
        afterFirstRender = true;
    }

    function handlePeak(bass, callback){

        if(bass > 240)
            peakDone = true;

        peakThrottle++;

        if(peakDone && peakThrottle > 100){
            
            var tempIndex = curSegmentIndex + segmentDir;
            changePlanetSegments(planet.obj, tempIndex);
            curSegmentIndex = tempIndex;

            if(curSegmentIndex >= segmentsArr.length - 1)
                segmentDir = -1;
            else if (curSegmentIndex <= 0)
                segmentDir = 1;

            peakDone = false;
            peakThrottle = 0;
        }

    }

    function changePlanetSegments(object, segments){
        curSegmentIndex = segments;
        planet.changeSegments(scene, segmentsArr[curSegmentIndex]);        
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


