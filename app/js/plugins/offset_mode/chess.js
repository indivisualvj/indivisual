{
    HC.plugins.offset_mode.chess = class Plugin extends HC.OffsetModePlugin {

        apply(shape) {
            let layer = this.layer;

            let m = layer.shapeSize(.5);

            if (shape.index % 2 === 0) {
                m = -layer.shapeSize(.5);
            }

            let x = this.settings.offset_x * m;
            let y = this.settings.offset_y * m;
            let z = this.settings.offset_z * m;

            shape.offset(x, y, z);
        }
    }
}
{
    HC.plugins.offset_mode.chessxyz = class Plugin extends HC.OffsetModePlugin {
        static name = 'chess XYZ';

        apply(shape) {
            let layer = this.layer;

            let mx = layer.shapeSize(.5);
            let my = mx;
            let mz = mx;

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

            let x = this.settings.offset_x * mx;
            let y = this.settings.offset_y * my;
            let z = this.settings.offset_z * mz;

            shape.offset(x, y, z);
        }
    }
}
