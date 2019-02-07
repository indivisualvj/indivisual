HC.plugins.pattern.cube = _class(false, HC.PatternPlugin, {
    name: 'cube',
    injections: {position: false},
    apply: function (shape) {
        var layer = this.layer;

        var edge = layer.diameterVector.y * this.settings.pattern_padding;
        var w = edge * this.settings.pattern_paddingx;
        var h = edge * this.settings.pattern_paddingy;
        var d = edge * this.settings.pattern_paddingz;
        var radius = 1;

        var shapesPerDimension = this.shapesPerDimension(layer);
        var position = this.cubePosition(shape);

        if (this.settings.pattern_audio) {
            var or = radius;
            if (this.settings.pattern_sync) {
                radius *= audio.volume;
            } else {
                radius *= shape.shapeVolume();
            }
            if (this.settings.pattern_limit) {
                radius = or + radius;
            }
        }

        var stepx = w / shapesPerDimension * radius;
        var stepy = h / shapesPerDimension * radius;
        var stepz = d / shapesPerDimension * radius;

        var x = (shapesPerDimension - 1) / -2 * stepx + position.x * stepx;
        var y = (shapesPerDimension - 1) / -2 * stepy + position.y * stepy;
        var z = (shapesPerDimension - 1) / -2 * stepz + position.z * stepz;

        layer.positionIn3dSpace(shape, x, y, z);
    },

    getDistributionOnCube: function (shapeCount, shapeIndex, vector) {
        var shapesPerDimension = Math.ceil(Math.pow(shapeCount, 1 / 3));

        var shapesPerLayer = Math.pow(shapesPerDimension, 2);

        var shapeLayerIndex = Math.floor(shapeIndex / shapesPerLayer);
        var shapesOnLayers = shapeLayerIndex * shapesPerLayer;
        var shapeIndexOnLayer = shapeIndex - shapesOnLayers;

        var shapeRowIndex = Math.floor(shapeIndexOnLayer / shapesPerDimension);
        var shapesOnRows = shapeRowIndex * shapesPerDimension;
        var shapeColumnIndex = shapeIndexOnLayer - shapesOnRows;

        vector.set(shapeColumnIndex, shapeRowIndex, shapeLayerIndex);
    },

    cubePosition: function (shape) {
        var params = this.params(shape);
        if (params.position === false) {

            params.position = new THREE.Vector3();
            this.getDistributionOnCube(this.layer.shapeCount(), shape.index, params.position);

        }

        return params.position;
    },

    shapesPerDimension: function () {
        return Math.ceil(Math.pow(this.layer.shapeCount(), 1 / 3));
    }
});
