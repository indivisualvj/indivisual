HC.plugins.rotation_offset_mode.chess45 = _class(false, HC.RotationOffsetModePlugin, {
    name: 'chess45',

    apply: function (shape) {
        var layer = this.layer;

        if (shape.index % 2 == 0) {
            var a = 45;

            var x = a * this.settings.rotation_offsetx;
            var y = a * this.settings.rotation_offsety;
            var z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
});

HC.plugins.rotation_offset_mode.chess90 = _class(false, HC.RotationOffsetModePlugin, {
    name: 'chess90',

    apply: function (shape) {
        var layer = this.layer;

        if (shape.index % 2 == 0) {
            var a = 90;

            var x = a * this.settings.rotation_offsetx;
            var y = a * this.settings.rotation_offsety;
            var z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
});

HC.plugins.rotation_offset_mode.chessrows90 = _class(false, HC.RotationOffsetModePlugin, {
    name: 'chessrows90',

    apply: function (shape) {
        var layer = this.layer;

        var gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
        if (gridPosition.y % 2 == 0) {
            var a = 90;

            var x = a * this.settings.rotation_offsetx;
            var y = a * this.settings.rotation_offsety;
            var z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
});

HC.plugins.rotation_offset_mode.chesscolumns90 = _class(false, HC.RotationOffsetModePlugin, {
    name: 'chesscolumns90',

    apply: function (shape) {
        var layer = this.layer;
        var gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
        if (gridPosition.x % 2 == 0) {
            var a = 90;

            var x = a * this.settings.rotation_offsetx;
            var y = a * this.settings.rotation_offsety;
            var z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }

    }
});
