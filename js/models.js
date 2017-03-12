
var Models = (function(){

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    /*
    * Pure Three.JS objects
    * Abstract within this Model
    */

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
    					side: THREE.DoubleSide, transparent: true, opacity: 0.9
    				}
    			)
    		);
    }

    /*
    * Space / Galaxy Objects
    * Planets, Orbit with Objects, Cube
    */

    //radius, segments, color, ringColor
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

    Planet.prototype.update = function(amp, bass, centroid){

        var scaleFactor         = 1 + bass / 200;
        var rotationFactor      = amp / 2560;

        this.rings.scale.x      = scaleFactor;
        this.rings.scale.z      = scaleFactor;
        
        this.rings.rotation.x   += rotationFactor * 2;
        this.rings.rotation.y   += rotationFactor * 3;

        this.obj.rotation.x     += rotationFactor * 2;
        this.obj.rotation.y     += rotationFactor * 3;
    }

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

    //radius, segs, color
    var Orbit = function(props, hasNoise){

        this.radius             = props.radius;
        this.segments           = props.segments;
        this.color              = props.color;        
        this.spacing            = props.spacing;
        this.speed              = props.speed;
        this.dir                = 1;
        this.stopped            = 1;
        this.hasNoise           = hasNoise;

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
        this.noiseForPath = this.geometry.vertices.map(() => Math.random());
        this.rollwindow = 10;

        var avg = this.noiseForPath.slice(0,this.rollwindow).reduce((acc, val) => acc+val, 0)*1.0/this.rollwindow;
        this.smoothnoise = this.noiseForPath.map((val, i) => {
            avg += this.noiseForPath[(i+this.rollwindow) % this.noiseForPath.length]*1.0/this.rollwindow;
            avg -= this.noiseForPath[i]*1.0/this.rollwindow;
            return avg;
        });
    }

    Orbit.prototype.add = function(orbitingObj){
        this.orbitingObjects.push(orbitingObj);
        this.obj.add(orbitingObj.obj);
    }

    Orbit.prototype.update = function(afterFirstRender, amp, bass, centroid){

        if (afterFirstRender)
            this.obj.geometry.verticesNeedUpdate = true;

        if(this.hasNoise)
        {
            for (var i = 0; i < this.smoothnoise.length; i++) {
                this.obj.geometry.vertices[i].setZ(this.smoothnoise[i] * amp / 100);
                //orbitPath.geometry.vertices[i].setX(smoothnoise[i] * amp / 100);
                //orbitPath.geometry.vertices[i].setY(smoothnoise[i] * amp / 100);
            }
        }

        if(bass > 240 || bass < 100)
            this.dir *= -1;

        this.stopped = bass < 100 ? 0 : 1;

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
            
            curObj.update(amp, bass, centroid);
        }

        var rotationFactor      = amp / 25600;
        
        this.obj.rotation.x   += rotationFactor * 2;
        this.obj.rotation.y   += rotationFactor * 3;
    }

    var Cube = function(length, color){

        this.obj = createCube(length, color);
        this.length = length;

        this.obj.position.x = 0;
        this.obj.position.y = 0;
    }
    
    Cube.prototype.isDead = function(){
        return false;
    }

    Cube.prototype.update = function(amp, bass, centroid){
        var scaleFactor = 1 + bass / (100 + Math.random() * 100);
        var rotationFactor = amp / 2560;

        this.obj.scale.x = scaleFactor;
        this.obj.scale.y = scaleFactor;
        this.obj.scale.z = scaleFactor;

        this.obj.rotation.x += rotationFactor * 1;
        this.obj.rotation.y += rotationFactor * 2;
    }
/*
    var CubeSystem = function(num, size){
        this.cubes = [];
        this.maxCubes = num;
        this.cubeSize = size;
    }

    CubeSystem.prototype.addCube = function() {
        if(this.cubes.length < this.maxCubes)
            this.particles.push(new Cube(this.cubeSize));
    };

    CubeSystem.prototype.addAll = function(props) {
        for (var i = this.cubes.length-1; i >= 0; i--) {

            var c = this.cubes[i];
            c.add();

            if (c.isDead()){
                this.cubes.splice(i, 1);
            }
        }
    };*/

    return {
        planet: Planet,
    	cube: Cube,
        orbit: Orbit
    }


})();