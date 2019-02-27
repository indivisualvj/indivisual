{
    HC.plugins.shape_geometry.tetrahedron = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 40;
        create() {
            var layer = this.layer;

            var geometry = new THREE.TetrahedronGeometry(layer.shapeSize(.5), this.getModA(0, 0));
            return geometry;
        }
    }
}
{
    HC.plugins.shape_geometry.octahedron = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 40;
        create() {
            var layer = this.layer;

            var geometry = new THREE.OctahedronGeometry(layer.shapeSize(.5), this.getModA(0, 0));
            return geometry;
        }
    }
}
{
    HC.plugins.shape_geometry.icosahedron = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 40;
        static tutorial = {
            shape_moda: {
                text: 'set number of detail'
            },
            sphere: {
                text: 'to create a sphere set the level of detail to x',
                action: function () {
                    controller.updateSetting(statics.ControlSettings.layer, 'shape_moda', 1, true, true, false);
                }
            }
        };

        create() {
            var layer = this.layer;

            var geometry = new THREE.IcosahedronGeometry(layer.shapeSize(.5), this.getModA(0, 0));
            return geometry;
        }
    }
}
