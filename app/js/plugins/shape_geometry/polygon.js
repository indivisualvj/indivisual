{
    HC.plugins.shape_geometry.polygon = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 20;
        static tutorial = {
            shapes: {
                text: 'triangle, rue, rect, hexagon, octagon, etc.'
            },
            shape_moda: {
                text: 'set number of edges',
            },
            shape_modb: {
                text: 'set the initial direction of the shape (shape_modb x 360/shape_moda/2 = degrees)'
            },
            circle: {
                text: 'set number of edges to 32',
                action: function () {
                    controller.updateSetting(statics.ControlSettings.layer, {shape:{shape_moda: 32}}, true, true);
                }
            },
            hive: {
                text: 'Create a hive by setting pattern to hive, shape_sizedivider to 16, edges to 6 and initial direction to 2',
                action: function () {
                    let data = {
                        pattern: {pattern: 'hive'},
                        shape: {
                            shape_moda: 6,
                            shape_modb: 2
                        },
                    };
                    controller.updateSettings(statics.ControlSettings.layer, data, true, false, true);
                    messaging.emitSettings(statics.ControlSettings.layer, data, true, true, true);
                }
            }
        };

        create() {
            let layer = this.layer;

            let edges = this.getModA(3, 3);
            let dir = this.getModB(0, 0);
            let size = layer.shapeSize(.5);

            let geometry = new HC.DirectionalCircle({
                edges: edges,
                direction: dir,
                radius: size
            }).create();

            return geometry;
        }
    }
}