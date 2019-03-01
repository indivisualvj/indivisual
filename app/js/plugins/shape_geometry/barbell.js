HC.plugins.shape_geometry.barbell = _class(false, HC.ShapeGeometryPlugin, {
    name: 'barbell',
    create() {
        var layer = this.layer;

        var geo = new THREE.Geometry();
        var plane = new THREE.PlaneGeometry(layer.shapeSize(1) * 1.15, layer.shapeSize(1) / 14);

        var pmesh = new THREE.Mesh(plane);
        pmesh.rotation.z = Math.PI / -4;
        pmesh.updateMatrix();
        geo.merge(pmesh.geometry, pmesh.matrix);

        var circ = new THREE.CircleGeometry(layer.shapeSize(.5) / 5, 24, Math.PI, Math.PI * 2);
        var cmesh = new THREE.Mesh(circ);
        cmesh.position.set(layer.shapeSize(.5), -layer.shapeSize(.5), 0);
        cmesh.updateMatrix();
        geo.merge(cmesh.geometry, cmesh.matrix);

        circ = new THREE.CircleGeometry(layer.shapeSize(.5) / 5, 24, Math.PI, Math.PI * 2);
        cmesh = new THREE.Mesh(circ);
        cmesh.position.set(-layer.shapeSize(.5), layer.shapeSize(.5), 0);
        cmesh.updateMatrix();
        geo.merge(cmesh.geometry, cmesh.matrix);

        var geometry = geo;
        return geometry;
    }
});
