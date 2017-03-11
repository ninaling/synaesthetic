
var Models = (function(){

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

    function initCube(length, color){
        return new Cube(length, color);
    }

    var Cube = function(length, color){

        this.obj = createCube(length, color);
        this.length = length;

        this.obj.position.x = 0;
        this.obj.position.y = 0;
    }

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;
    
    Cube.prototype.isDead = function(){
       /* var length = this.length;

        return  this.obj.position.x < -length ||
                this.obj.position.y < -length ||
                this.obj.position.x > winWidth + length ||
                this.obj.position.y > winHeight + length;*/

        return false;
    }

    Cube.prototype.update = function(amp, bass, centroid){
        var scaleFactor = 1 + bass/200;
        var rotationFactor = amp / 2560;

        this.obj.scale.x = scaleFactor;
        this.obj.scale.y = scaleFactor;
        this.obj.scale.z = scaleFactor;

        this.obj.rotation.x += rotationFactor * 2;
        this.obj.rotation.y += rotationFactor * 3;
    }

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
    };

    return {
    	createSphere: createSphere,
    	createRings: createRings,
    	cube: Cube
    }


})();