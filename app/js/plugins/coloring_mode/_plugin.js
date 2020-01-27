HC.plugins.coloring_mode = HC.plugins.coloring_mode || {};
{
    HC.ColoringModePlugin = class Plugin extends HC.AnimationPlugin {

        before(shape) {
            // let locked = this.shapeColoringModeLocked(shape);
            // if (locked) {
            //     return false;
            // }
        }

        after(shape) {
            let c = shape.color;
            c.h += this.settings.coloring_hue;
            c.s *= this.settings.coloring_sat;
            c.l *= this.settings.coloring_lum * 2;

            if (this.settings.coloring_audio && this.animation.audioManager.isActive()) {
                let v = this.audioAnalyser.volume;
                if (!this.settings.coloring_sync) {
                    v = shape.shapeVolume();
                }

                c.h += v * 180;
            }

            c.h = c.h % 360;
        }

        // shapeColoringModeLocked (shape, enabled) {
        //     if (shape) {
        //         let plugin = this.layer.getColoringModePlugin();
        //         let params = plugin.params(shape);
        //         if (enabled !== undefined) {
        //             params.__locked = enabled;
        //         }
        //         return params.__locked;
        //     }
        //
        //     return false;
        // }
    }
}
