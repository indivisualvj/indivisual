HC.plugins.rotation_offset_mode.chess45lr = _class(false, HC.RotationOffsetModePlugin, {
    name: 'chess45lr',

    apply(shape) {
        var layer = this.layer;

        var a = 45;
        if (shape.index % 2 == 0) {
        } else {
            a *= -1;
        }

        var x = a * this.settings.rotation_offsetx;
        var y = a * this.settings.rotation_offsety;
        var z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
});

HC.plugins.rotation_offset_mode.chess90lr = _class(false, HC.RotationOffsetModePlugin, {
    name: 'chess90lr',

    apply(shape) {
        var layer = this.layer;

        var a = 90;
        if (shape.index % 2 == 0) {
        } else {
            a *= -1;
        }

        var x = a * this.settings.rotation_offsetx;
        var y = a * this.settings.rotation_offsety;
        var z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
});

HC.plugins.rotation_offset_mode.chessrowslr = _class(false, HC.RotationOffsetModePlugin, {
    name: 'chessrowslr',

    apply(shape) {
        var layer = this.layer;

        var a = 90;
        var gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
        if (gridPosition.y % 2 == 0) {
        } else {
            a *= -1;
        }

        var x = a * this.settings.rotation_offsetx;
        var y = a * this.settings.rotation_offsety;
        var z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
});

HC.plugins.rotation_offset_mode.chesscolumnslr = _class(false, HC.RotationOffsetModePlugin, {
    name: 'chesscolumnslr',

    apply(shape) {
        var layer = this.layer;
        var gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
        var a = 90;
        if (gridPosition.x % 2 == 0) {
        } else {
            a *= -1;
        }

        var x = a * this.settings.rotation_offsetx;
        var y = a * this.settings.rotation_offsety;
        var z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
});
