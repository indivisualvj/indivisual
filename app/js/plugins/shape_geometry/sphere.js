{
    HC.plugins.shape_geometry.sphere = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 40;
        static tutorial = {
            shape_moda: {
                text: 'set width segments'
            },
            shape_modb: {
                text: 'set height segments'
            },
            sphere: {
                text: 'to create a sphere set the level of detail to 3',
                action: function () {
                    this.animation.updateSetting(this.config.ControlSettings.layer, {shape:{shape_moda: 3}}, true, true, false);
                }
            }
        };

        create() {
            let layer = this.layer;

            return new THREE.SphereGeometry(layer.shapeSize(.5), this.getModA(1, 1, 64), this.getModB(1, 1, 64));
        }
    }
}
