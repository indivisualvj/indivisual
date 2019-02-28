{
    HC.plugins.coloring_mode.onergb = class Plugin extends HC.ColoringModePlugin {

        apply (shape) {

            if (this.isFirstShape(shape)) {

                let prc = (animation.now - beatkeeper.beatStartTime) / (60000 / statics.ControlSettings.tempo) / 100 * this.settings.coloring_volume;
                prc = HC.Osci.sinInOut(prc) * 5;

                prc *= RAD * 180 * this.settings.coloring_volume;

                let r = (Math.sin(prc) / 2 + 0.5) * 255;
                let g = (Math.sin(prc + 60 * RAD) / 2 + 0.5) * 255;
                let b = (Math.sin(prc + 120 * RAD) / 2 + 0.5) * 255;

                this.color = rgbToHsl({r: r, g: g, b: b});
            }

            copyHsl(this.color, shape.color);
        }

    }
}