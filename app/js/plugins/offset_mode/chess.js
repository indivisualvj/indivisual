HC.plugins.offset_mode.chess = _class(false, HC.OffsetModePlugin, {

    apply: function (shape) {
        var layer = this.layer;

        var m = layer.shapeSize(.5);

        if (shape.index % 2 == 0) {
            m = -layer.shapeSize(.5);
        }

        var x = this.settings.offset_x * m;
        var y = this.settings.offset_y * m;
        var z = this.settings.offset_z * m;

        shape.offset(x, y, z);
    }
});

HC.plugins.offset_mode.chessxyz = _class(false, HC.OffsetModePlugin, {
    name: 'chess XYZ',

    apply: function (shape) {
        var layer = this.layer;

        var mx = layer.shapeSize(.5);
        var my = mx;
        var mz = mx;

        switch (shape.index % 3) {
            case 0:
                mx = -mx;
                break;

            case 1:
                my = -my;
                break;

            case 2:
                mz = -mz;
                break;
        }

        var x = this.settings.offset_x * mx;
        var y = this.settings.offset_y * my;
        var z = this.settings.offset_z * mz;

        shape.offset(x, y, z);
    }
});

