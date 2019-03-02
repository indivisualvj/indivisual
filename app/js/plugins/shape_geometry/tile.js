{
    HC.plugins.shape_geometry.tile = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 10;
        static tutorial = {
            shape_moda: {
                text: 'set corner radius'
            },
            shape_modb: {
                text: 'set number of curve segments'
            }
        };

        create() {
            let layer = this.layer;

            let geometry = new HC.RoundedRect(layer.shapeSize(1), this.getModA(1, 1), this.getModB(1, 12)).create();
            this.assignUVs(geometry);
            return geometry;
        }
    }
}