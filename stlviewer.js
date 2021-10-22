function STLViewerEnable(classname) {
    var models = document.getElementsByClassName(classname);
    for (var i = 0; i < models.length; i++) {
        STLViewer(models[i], models[i].getAttribute("data-src"));
    }
}

function STLViewer(elem, model) {

    if (!WEBGL.isWebGLAvailable()) {
        elem.appendChild(WEBGL.getWebGLErrorMessage());
        return;
    }

    var renderer = new THREE.WebGLRenderer({ alpha: true });
    var camera = new THREE.PerspectiveCamera(75, elem.clientWidth / elem.clientHeight, 0.001, 1000);
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.appendChild(renderer.domElement);

    window.addEventListener('resize', function() {
        renderer.setSize(elem.clientWidth, elem.clientHeight);
        camera.aspect = elem.clientWidth / elem.clientHeight;
        camera.updateProjectionMatrix();
    }, false);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.9;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 5;

    var scene = new THREE.Scene();

    var light = new THREE.HemisphereLight(0x231f20, 0xffffff, 1);
    scene.add(light);
    (new THREE.STLLoader()).load(model, function(geometry) {
        var material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 100, shininess: 100 });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Compute the middle
        var middle = new THREE.Vector3();
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(middle);

        // Center it
        mesh.position.x = -1 * middle.x;
        mesh.position.y = -1 * middle.y;
        mesh.position.z = -1 * middle.z;

        // Pull the camera away as needed
        var largestDimension = Math.max(geometry.boundingBox.max.x,
                geometry.boundingBox.max.y, geometry.boundingBox.max.z)
            //camera.position.z = largestDimension * 1.25;
        camera.position.y = -largestDimension * 1.30;


        var animate = function() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

    });
}
