{
    HC.plugins.rotation_offset_mode.chess45 = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'chess45';

        apply(shape) {
            if (shape.index % 2 == 0) {
                var a = 45;

                var x = a * this.settings.rotation_offsetx;
                var y = a * this.settings.rotation_offsety;
                var z = a * this.settings.rotation_offsetz;

                shape.rotationOffset(x, y, z);
            }
        }
    }
}
{
    HC.plugins.rotation_offset_mode.chess90 = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'chess90';

        apply(shape) {
            if (shape.index % 2 == 0) {
                var a = 90;

                var x = a * this.settings.rotation_offsetx;
                var y = a * this.settings.rotation_offsety;
                var z = a * this.settings.rotation_offsetz;

                shape.rotationOffset(x, y, z);
            }
        }
    }
}
{
    HC.plugins.rotation_offset_mode.chessrows90 = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'chessrows90';

        apply(shape) {
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
    }
}
{
    HC.plugins.rotation_offset_mode.chesscolumns90 = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'chesscolumns90';

        apply(shape) {
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
    }
}