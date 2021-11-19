{
    HC.plugins.background_mode.flash = class Plugin extends HC.BackgroundModePlugin {
        static name = 'flash background color';
        static index = 20;
        static tutorial = {
            color: {
                text: 'set background_color to any hex code (#ffaabb) to change color'
            }
        };

        apply(color) {
            let layer = this.layer;

            let speed = layer.getCurrentSpeed();
            if (this.backflash) {
                let hsl = this.backflash;

                hsl.l -= hsl.l * this.animation.getFrameDurationPercent(500, .125 * this.settings.background_volume);
                if (hsl.l > 1 && hsl.l < 99) {
                    this.layer.setBackground(new THREE.Color(this.current(HC.hslToHex(hsl))));

                } else {
                    this.backflash = false;
                    this.layer.setBackground(this.current(false));
                }

            } else if (this.current() !== false) {
                this.layer.setBackground(this.current(false));
            }

            if ((this.audioAnalyser.peak || speed.prc === 0 || randomInt(0, round(this.config.DisplaySettings.fps * .75)) === 0)) {
                if (randomBool(10)) {
                    // todo try to fade to this.displayBackground
                    // this.displayBackground = HC.hexToHsl(this.config.DisplaySettings.background);
                    this.backflash = HC.hexToHsl(color || this.settings.background_color);
                    this.backflash.l = this.settings.background_volume > 0 ? 75 : 5;
                    this.layer.setBackground(new THREE.Color(this.current(HC.hslToHex(this.backflash))));
                }
            }
        }
    }
}
{
    HC.plugins.background_mode.flashcomplementary = class Plugin extends HC.plugins.background_mode.flash {
        static name = 'flash random shape\'s complementary';
        static index = 30;

        apply() {
            let layer = this.layer;
            HC.plugins.background_mode.flash.prototype.apply.call(this, layer.shapeColor(true, true));
        }
    }
}
