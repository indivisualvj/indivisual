HC.plugins.background_mode.flash = _class(
    function () {
        this.backflash = false;
    }, HC.BackgroundModePlugin, {
        name: 'flash background color',
        apply: function (color) {
            var layer = this.layer;

            var speed = layer.getCurrentSpeed();
            if (this.backflash) {
                var hsl = this.backflash;

                hsl.l -= hsl.l * animation.getFrameDurationPercent(500, .125 * this.settings.background_volume);
                if (hsl.l > 1 && hsl.l < 99) {
                    this.layer.setBackground(hslToHex(hsl));

                } else {
                    this.backflash = false;
                    this.layer.setBackground('');
                }

            }
            if ((audio.peak || speed.prc == 0 || randomInt(0, round(statics.DisplaySettings.fps * .75)) == 0)) {
                if (randomBool(10)) {
                    this.backflash = hexToHsl(color || this.settings.background_color);
                    this.backflash.l = this.settings.background_volume > 0 ? 75 : 5;
                    this.layer.setBackground(hslToHex(this.backflash));
                }
            }
        }
    }
);

HC.plugins.background_mode.flashcomplementary = _class(false, HC.BackgroundModePlugin, {
    name: 'flash random shape\'s complementary',
    apply: function () {
        var layer = this.layer;
        layer.getBackgroundModePlugin('flash').apply(layer.shapeColor(true, true));
    }
});

