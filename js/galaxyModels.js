
/*
* GalaxyModels.js
* A Three.JS wrapper for galaxy objects,
* which update according to mic input
*/

var GalaxyModels = (function(){

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    /*******************************************
    * Pure Three.JS objects
    * "Abstract" within this Model
    ********************************************/

	function createSphere(radius, segments, color) {
    	return new THREE.Mesh(
    		new THREE.SphereGeometry(radius, segments, segments),
    		new THREE.MeshBasicMaterial(
    			{
    				color: color,
    				wireframe: true
    			}
    		)
    	);
    }

    function createCube(length, color){
        var material = new THREE.MeshBasicMaterial( {
            color: color,
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1
        } );

        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry(length,length,length),
            material
        )

        return mesh;
    }
    function createRings(radius, segments, color) {
    	return 	new THREE.Mesh(new THREE.XRingGeometry(1.2 * radius, 2 * radius, 2 * segments, 5, 0, Math.PI * 2),
    			new THREE.MeshBasicMaterial(
    				{	
    					color: color,
    					wireframe: false,
    					side: THREE.DoubleSide
    				}
    			)
    		);
    }

    /***************************************************
    **** Space / Galaxy Objects
    **** Planets, Orbit with Objects, Cube
    ***************************************************/


    /* @param props     {object}
        * radius        {float} 
        * segments      {int}
        * color         {string} hex value
        * ringColor     {string} hex value
    * */
    var Planet = function(props, rotationSphere, rotationRing, scale){
       this.create(props, rotationSphere, rotationRing, scale);
    }

    var Planet = function(props, rotationScalar){
        var rotation = new THREE.Euler(rotationScalar, rotationScalar, rotationScalar);
        var vector   = new THREE.Vector3(1,1,1);
        this.create(props, rotation, rotation, vector);
    }

    Planet.prototype.create = function(props, rotationSphere, rotationRing, scale){

        this.radius             = props.radius;
        this.segments           = props.segments;
        this.color              = props.color;
        this.ringColor          = props.ringColor;

        this.obj                = createSphere(this.radius, this.segments, this.color);
        this.obj.rotation       = rotationSphere;
        this.obj.position.setZ(2);

        this.rings              = createRings(this.radius, this.segments, this.ringColor);
        this.rings.rotation.x   = rotationRing.x;
        this.rings.rotation.y   = rotationRing.y;
        this.rings.rotation.z   = rotationRing.z;

        this.rings.scale.x      = scale.x;
        this.rings.scale.y      = scale.y;
        this.rings.scale.z      = scale.z;

        this.obj.add(this.rings);   
    }

    /*
    * @param mic {object} of amplitude, bass, treble, and centroid
    */
    Planet.prototype.update = function(mic){

        var scaleFactor         = 1 + mic.bass / 200;
        var rotationFactor      = mic.bass > 150 
                                    ? mic.amp / 2560
                                    : mic.amp / 10000;

        this.rings.scale.x      = scaleFactor;
        this.rings.scale.z      = scaleFactor;
        
        this.rings.rotation.x   += rotationFactor * 2;
        this.rings.rotation.y   += rotationFactor * 3;

        this.obj.rotation.x     += rotationFactor * 2;
        this.obj.rotation.y     += rotationFactor * 3;
    }

    /*
    * removes this object from scene, and re-adds with cloned properties,
    * replacing only segments property
    */
    Planet.prototype.changeSegments = function(scene, segments){
        if(segments != this.segments){
            this.segments = segments;
            
            var rotationSphere = this.obj.rotation;
            var rotationRing = this.rings.rotation;
            var tempScale = this.rings.scale;

            scene.remove(this.obj);

            this.create({
                radius:     this.radius,
                segments:   segments,
                color:      this.color,
                ringColor:  this.ringColor

            }, rotationSphere, rotationRing, tempScale);

            scene.add(this.obj);
        }
    }

    /*
    * Orbit constructor
    * @param props {object}
        * radius   {float} 
        * segments {int}
        * color    {string} hex value
        * spacing  {int} space between orbiting objects
        * rotation {float} range 0 <-> 2 * Math.PI
        * speed    {int}
    *
    * @param hasNoise {bool} whether to add noise
    */
    var Orbit = function(props, hasNoise){

        this.radius             = props.radius;
        this.segments           = props.segments;
        this.color              = props.color;        
        this.spacing            = props.spacing;
        this.speed              = props.speed;
        this.dir                = 1;
        this.stopped            = 1;
        this.hasNoise           = hasNoise;
        this.curSpeedTier       = 0;
        this.isSwitchingDir     = false;

        this.orbitingObjects    = [];

        this.material           = new THREE.LineBasicMaterial({
                                        color: this.color,
                                        transparent: true,
                                        opacity: 0
                                    });
        this.geometry           = new THREE.CircleGeometry(this.radius, this.segments);


        this.geometry.verticesNeedUpdate = true;
        this.geometry.dynamic            = true;
        this.geometry.vertices.shift();

        this.obj                = new THREE.Line(this.geometry, this.material);
        this.obj.rotation.x     = props.rotation;
        this.orbitIndex         = 0;


        if(this.hasNoise)
            this.addNoise();

    }

    Orbit.prototype.addNoise = function(){
        this.noiseForPath = this.geometry.vertices.map(function(){ return Math.random();});
        this.rollwindow = 10;

        var avg = this.noiseForPath.slice(0,this.rollwindow).reduce(function(acc, val){ return acc+val;}, 0)*1.0/this.rollwindow;
        
        var that = this;
        this.smoothnoise = this.noiseForPath.map(function(val, i){
            avg += that.noiseForPath[(i+this.rollwindow) % that.noiseForPath.length]*1.0/that.rollwindow;
            avg -= that.noiseForPath[i]*1.0/that.rollwindow;
            return avg;
        });
    }

    /*
    * Adds objects to the orbital.
    * @param orbitingObj {object}
        * must have an update(mic) function
    */
    Orbit.prototype.add = function(orbitingObj){
        this.orbitingObjects.push(orbitingObj);
        this.obj.add(orbitingObj.obj);
    }

    /*
    * Keeps track of switching dir to throttle repeat successive calls
    */
    Orbit.prototype.switchDir = function(){
        if(!this.isSwitchingDir)
            this.dir *= -1;
        this.isSwitchingDir = true;
    }

    /*
    * Updates orbit properties on each call
    * @param props {object}
        * holds array size n of breakpoints,
        * array size n + 1 of speeds
    * @param mic {object} of amplitude, bass, treble, and centroid
    */
    Orbit.prototype.update = function(props, mic, afterFirstRender){

        //boundary conditions
        if(props.breakpoints.length != props.speeds.length - 1)
            return;

        if (afterFirstRender)
            this.obj.geometry.verticesNeedUpdate = true;

        if(mic.bass > 240 || mic.bass < 100)
            this.switchDir();

        this.stopped = mic.bass < 100 ? 0 : 1;


        //update properties according to speeds and breakpoints from props
        for(var i = 0; i < props.speeds.length; i++)
        {
            if((i == props.breakpoints.length) || (mic.bass < props.breakpoints[i]))
            {
                this.speed = props.speeds[i];
                if(this.curSpeedTier != i)
                    this.switchDir();
                else
                    this.isSwitchingDir = false;

                this.curSpeedTier = i;
                break;
            }
        }

        //actually update orbit object speeds
        this.orbitIndex = (this.orbitIndex + this.speed * this.dir * this.stopped) % this.geometry.vertices.length;
        var tempIndex = this.orbitIndex > 0 ? this.orbitIndex : this.orbitIndex + this.geometry.vertices.length;
        
        for(var i = 0; i < this.orbitingObjects.length; i++)
        {
            var curObj = this.orbitingObjects[i];

            tempIndex %= this.geometry.vertices.length;
            var newpos = this.geometry.vertices[tempIndex];

            curObj.obj.position.set(newpos.x, newpos.y, newpos.z);
            tempIndex = (tempIndex + this.spacing) % this.geometry.vertices.length;
            tempIndex = tempIndex > 0 ? tempIndex : (tempIndex + this.geometry.vertices.length);
            
            curObj.update(mic);
        }

        var rotationFactor    = mic.amp / 25600;
        
        this.obj.rotation.x   += rotationFactor * 2;
        this.obj.rotation.y   += rotationFactor * 3;

        //update noise stuff
        if(this.hasNoise)
        {
            for (var i = 0; i < this.smoothnoise.length; i++) {
                this.obj.geometry.vertices[i].setZ(this.smoothnoise[i] * mic.amp / 100);
            }
        }
    }

    var Cube = function(length, color){

        this.obj = createCube(length, color);
        this.length = length;

        this.obj.position.x = 0;
        this.obj.position.y = 0;
    }
    

    Cube.prototype.update = function(mic){
        var scaleFactor = 1 + mic.bass / (100 + Math.random() * 100);
        var rotationFactor = mic.amp / 2560;

        this.obj.scale.x = scaleFactor;
        this.obj.scale.y = scaleFactor;
        this.obj.scale.z = scaleFactor;

        this.obj.rotation.x += rotationFactor * 1;
        this.obj.rotation.y += rotationFactor * 2;
    }

    return {
        planet: Planet,
    	cube: Cube,
        orbit: Orbit
    }


})();