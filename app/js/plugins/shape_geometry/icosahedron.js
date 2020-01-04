{
    HC.plugins.shape_geometry.icosahedron = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 40;
        static tutorial = {
            shape_moda: {
                text: 'set level of detail'
            },
            sphere: {
                text: 'to create a sphere set the level of detail to 3',
                action: function () {
                    controller.updateSetting(statics.ControlSettings.layer, {shape:{shape_moda: 3}}, true, true, false);
                }
            }
        };

        create() {
            let layer = this.layer;

            return new THREE.IcosahedronGeometry(layer.shapeSize(.5), this.getModA(0, 0, 5));
        }
    }
}
