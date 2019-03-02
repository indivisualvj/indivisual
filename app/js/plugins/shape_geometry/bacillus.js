{
    HC.plugins.shape_geometry.bacillus = class Plugin extends HC.ShapeGeometryPlugin {
        create() {
            let layer = this.layer;

            let shape = new THREE.Shape();

            let hw = layer.shapeSize(.5) * .75;
            let hh = layer.shapeSize(.5) / 6;
            let r = hh;
            shape.moveTo(-hw, hh);
            shape.lineTo(hw, hh);
            shape.absarc(hw, 0, r, .5 * Math.PI, 1.5 * Math.PI, true);
            shape.lineTo(-hw, -hh);
            shape.absarc(-hw, 0, r, 1.5 * Math.PI, 2.5 * Math.PI, true);

            let geometry = new THREE.ShapeGeometry(shape, this.getModB(1, 8));
            geometry.rotateZ(45 * RAD * this.getModA(0, 0));
            return geometry;
        }
    }
}
