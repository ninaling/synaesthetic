
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
    	createSphere: createSphere,
    	createRings: createRings,
    	createCube: createCube
    }


})();