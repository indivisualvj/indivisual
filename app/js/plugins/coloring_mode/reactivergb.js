{
    HC.plugins.coloring_mode.reactivergb = class Plugin extends HC.ColoringModePlugin {
        static name = 'reactive RGB';

        apply(shape, reactive, radial) {
            let layer = this.layer;

            let color = shape.color;
            color = hslToRgb(color);
            let matrix = layer.getPatternPlugin('matrix');
            let gridPosition = matrix.gridPosition(shape);

            let v = 0.75 * this.settings.coloring_volume;
            let m1 = 2;
            if (reactive !== false) {
                let sync = this.settings.coloring_sync;
                let fbdv = shape.shapeVolume();

                if (!sync && gridPosition.y > 1) {
                    let i = gridPosition.x - 1;
                    if (layer.shapes[i]) {
                        let c2 = layer.shapes[i];
                        fbdv = c2.shapeVolume() * 0.6;
                    }
                }

                v = (!sync ? fbdv : audio.volume);
                m1 = (this.animation.audioManager.isActive() ? 8 : 2);
            }

            let prc;
            if (radial) {
                let ps = new THREE.Vector2(shape.x(), shape.y());
                let dv = layer.resolution('half');
                ps.sub(dv);

                prc = (reactive ? 6 : 3) * (layer.resolution('half').length() - ps.length()) / layer.resolution('half').length();

            } else {
                prc = m1 * (1 + gridPosition.y) / matrix.rowCount(layer); // original KEEP!
            }

            prc *= RAD * 180 * v * this.settings.coloring_volume;

            color.r = (Math.sin(prc) / 2 + 0.5) * 255;
            color.g = (Math.sin(prc + 60 * RAD) / 2 + 0.5) * 255;
            color.b = (Math.sin(prc + 120 * RAD) / 2 + 0.5) * 255;

            color = rgbToHsl(color);
            copyHsl(color, shape.color);
        }
    }
}
{
    HC.plugins.coloring_mode.reactivergbc = class Plugin extends HC.ColoringModePlugin {
        static name = 'reactive RGB center';

        apply(shape) {
            let layer = this.layer;
            layer.getColoringModePlugin('reactivergb').apply(shape, true, true);
        }
    }
}
{
    HC.plugins.coloring_mode.floatrgb = class Plugin extends HC.ColoringModePlugin {
        static name = 'float RGB';

        apply(shape) {
            let layer = this.layer;
            layer.getColoringModePlugin('reactivergb').apply(shape, false, false);
        }
    }
}
{
    HC.plugins.coloring_mode.floatrgbc = class Plugin extends HC.ColoringModePlugin {
        static name = 'float RGB center';

        apply(shape) {
            let layer = this.layer;
            layer.getColoringModePlugin('reactivergb').apply(shape, false, true);
        }
    }
}
