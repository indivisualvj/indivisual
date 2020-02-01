{
    HC.plugins.shape_geometry.steppedpolygon = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 20;
        static name = 'polygon (stepped)';
        static tutorial = {
            shapes: {
                text: 'stepped triangle, rue, rect, hexagon, octagon, etc.'
            },
            shape_moda: {
                text: 'set number of edges',
            },
            shape_modb: {
                text: 'set the initial direction of the shape (shape_modb x 360/shape_moda/2 = degrees)'
            },
            shape_modc: {
                text: 'set number of stepped overlapping shapes'
            },
            steprect: {
                text: 'Set overlapping shapes to 4. Set number of edges to 4. Set direction to 2. Set material_blending to normal or additive and reduce coloring_opacity to make the single steps shine through',
                action: function () {
                    let data = {
                        shape: {
                            shape_moda: 4,
                            shape_modb: 2,
                            shape_modc: 4
                        },
                        coloring:{coloring_opacity: .5},
                        material:{material_blending: 'NormalBlending'}
                    };
                    this.animation.updateSettings(this.config.ControlSettings.layer, data, false, false, true);
                    messaging.emitSettings(this.config.ControlSettings.layer, data, false, false, true);
                },
            }
        };

        create() {
            let layer = this.layer;

            let edges = this.getModA(3, 3);
            let dir = this.getModB(0, 0);
            let steps = this.getModC(2, 2);
            let size = layer.shapeSize(.5);
            let step = size / steps;
            let zoffset = (steps-1) * steps/2;
            let geometry = new THREE.Geometry();
            for (let i = 1; i <= steps; i++) {
                let circ = new HC.DirectionalCircle({
                    edges: edges,
                    direction: dir,
                    radius: i * step
                }).create();
                circ.translate(0, 0, (steps - i) - zoffset);
                let mesh = new THREE.Mesh(circ);
                geometry.merge(mesh.geometry, mesh.matrix);
            }

            return geometry;
        }
    }
}
