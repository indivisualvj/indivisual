{
    HC.plugins.rotation_offset_mode.chess45lr = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'chess45lr';

        apply(shape) {
            let a = 45;
            if (shape.index % 2 == 0) {
            } else {
                a *= -1;
            }

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}
{
    HC.plugins.rotation_offset_mode.chess90lr = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'chess90lr';

        apply(shape) {
            let a = 90;
            if (shape.index % 2 == 0) {
            } else {
                a *= -1;
            }

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}
{
    HC.plugins.rotation_offset_mode.chessrowslr = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'chessrowslr';

        apply(shape) {
            let layer = this.layer;

            let a = 90;
            let gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
            if (gridPosition.y % 2 == 0) {
            } else {
                a *= -1;
            }

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}
{
    HC.plugins.rotation_offset_mode.chesscolumnslr = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'chesscolumnslr';

        apply(shape) {
            let layer = this.layer;
            let gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
            let a = 90;
            if (gridPosition.x % 2 == 0) {
            } else {
                a *= -1;
            }

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}