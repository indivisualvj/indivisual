{
    HC.plugins.shape_geometry.pipe = class Plugin extends HC.ShapeGeometryPlugin {
        create() {
            let layer = this.layer;

            let size = layer.shapeSize(1);
            let halfSize = layer.shapeSize(.5);
            let geometry = new THREE.CylinderGeometry(halfSize, halfSize, size, this.getModA(2, 16), this.getModB(1, 1), true);
            geometry.rotateX(45 * RAD + this.settings.shape_moda * 45 * RAD);
            return geometry;
        }
    }
}
{
    HC.plugins.shape_geometry.cylinder = class Plugin extends HC.ShapeGeometryPlugin {
        create() {
            let layer = this.layer;

            let size = layer.shapeSize(1);
            let halfSize = layer.shapeSize(.5);
            let geometry = new THREE.CylinderGeometry(halfSize, halfSize, size, this.getModA(2, 16), this.getModB(1, 1), false);
            geometry.rotateX(45 * RAD + this.settings.shape_moda * 45 * RAD);
            return geometry;
        }
    }
}