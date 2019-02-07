HC.plugins.pattern.hive = _class(false, HC.PatternPlugin, {
    name: 'hive',

    apply: function (shape, mover) {
        var layer = this.layer;
        var gapx = layer.shapeSize(1) * 0.75 * this.settings.pattern_paddingx;
        var nh = layer.shapeSize(1) * 0.87 * this.settings.pattern_paddingy;
        var gapy = nh;
        var matrix = layer.getPatternPlugin('matrix');
        var gridPosition = matrix.gridPosition(shape);

        gapx *= this.settings.pattern_padding;
        gapy *= this.settings.pattern_padding;

        var ox = (-gapx * matrix.columnCount(layer)) / 2;
        var oy = (-gapy * matrix.rowCount(layer)) / 2;

        if (gridPosition.y % 2 == 0) {
            if (shape.index % 2 == 0) {
                oy -= nh / 2;
            }

        } else {
            if (shape.index % 2 == 1) {
                oy -= nh / 2;
            }
        }

        var x = ox + gridPosition.x * gapx - gapx / 2;
        var y = oy + gridPosition.y * gapy - gapy / 4;
        var z = 0;

        layer.positionIn3dSpace(shape, x, -y, z);

        this.sharedMoverParams(ox, oy, gapx, gapy);
    }
});

HC.plugins.pattern.trihive = _class(false, HC.PatternPlugin, {
    name: 'trihive',

    apply: function (shape) {
        var layer = this.layer;

        var matrix = layer.getPatternPlugin('matrix');
        var gridPosition = matrix.gridPosition(shape);
        var gapx = layer.shapeSize(1) * 0.43 * this.settings.pattern_paddingx;
        var nh = layer.shapeSize(1) * 0.75 * this.settings.pattern_paddingy;
        var gapy = nh;

        gapx *= this.settings.pattern_padding;
        gapy *= this.settings.pattern_padding;

        var ox = (-gapx * matrix.columnCount(layer)) / 2;
        var oy = (-gapy * matrix.rowCount(layer)) / 2;

        if (shape.index % 2 == 1) {
            oy -= layer.shapeSize(.5) * 0.5;
        }

        var x = ox + gridPosition.x * gapx - gapx / 2;
        var y = oy + gridPosition.y * gapy - gapy / 4;
        var z = 0;

        layer.positionIn3dSpace(shape, x, -y, z);

        this.sharedMoverParams(ox, oy, gapx, gapy);
    }
});

HC.plugins.pattern.hexhive = _class(false, HC.PatternPlugin, {
        name: 'hexhive',

        apply: function (shape) {
            var layer = this.layer;
            var matrix = layer.getPatternPlugin('matrix');
            var gridPosition = matrix.gridPosition(shape);
            var gapx = 0.86 * layer.shapeSize(1) * this.settings.pattern_paddingx;
            var gapy = 0.75 * layer.shapeSize(1) * this.settings.pattern_paddingy;

            gapx *= this.settings.pattern_padding;
            gapy *= this.settings.pattern_padding;

            var ox = (-gapx * matrix.columnCount(layer)) / 2;
            var oy = (-gapy * matrix.rowCount(layer)) / 2;

            if (gridPosition.y % 2 == 0) {
                ox -= layer.shapeSize(.5) * 0.87;
            }

            var x = ox + gridPosition.x * gapx - gapx / 2;
            var y = oy + gridPosition.y * gapy - gapy / 2;
            var z = 0;

            layer.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        }
    });

HC.plugins.pattern.ruehive = _class(false, HC.PatternPlugin, {
        name: 'ruehive',

        apply: function (shape) {
            var layer = this.layer;
            var matrix = layer.getPatternPlugin('matrix');
            var gridPosition = matrix.gridPosition(shape);
            var gapx = layer.shapeSize(1) * this.settings.pattern_paddingx;
            var gapy = 0.5 * layer.shapeSize(1) * this.settings.pattern_paddingy;

            gapx *= this.settings.pattern_padding;
            gapy *= this.settings.pattern_padding;

            var ox = -gapx * matrix.columnCount(layer) / 2;
            var oy = -gapy * matrix.rowCount(layer) / 2;

            if (gridPosition.y % 2 == 1) {
                ox -= layer.shapeSize(.5);
            }

            var x = ox + gridPosition.x * gapx - gapx / 2;
            var y = oy + gridPosition.y * gapy - gapy / 2;
            var z = 0;

            layer.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        }
    }
);
