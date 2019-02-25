(function () {
    /**
     *
     * @param index
     * @constructor
     *
     * mapping 1280x720 UpperLeftCorner: {"targetPoints":[[5760,3240],[5840,3240],[5840,3241],[5760,3241]]}
     *
     */
    HC.Lighting = function (index) {
        this.type = 'Lighting';
        this.index = index;
        this.id = this.type + this.index;
        this._bounds = false;
        this.pixel = [];
        this.scale = 1;
        this.lighting_type = 'off';
        this._strobeModuloOdd = false;
    };

    HC.Lighting.prototype = {

        /**
         *
         * @param width
         * @param height
         */
        update: function () {
            var pixelUpdate = this.pixel.length != statics.SourceSettings.lighting_pattern_lights;
            var scaleUpdate = this.scale != statics.SourceSettings.lighting_scale;
            if (pixelUpdate || scaleUpdate) {
                this.init();
            }

            this.lighting_type = statics.SourceSettings.lighting_type;
        },

        /**
         *
         */
        init: function () {
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.ctx = this.canvas.getContext('2d');
                this.canvas.id = this.id;
            }

            this.scale = statics.SourceSettings.lighting_scale;
            this.pixel = [];
            for (var i = 0; i < statics.SourceSettings.lighting_pattern_lights; i++) {
                this.pixel[i] = {
                    brightness: 0.0,
                    color: '#ff0000'
                }
            }

            this.canvas.width = this.width = this.pixel.length * 4 * this.scale;
            this.canvas.height = this.height = 1 * this.scale;
        },

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds: function () {
            return new HC.Rectangle(0, 0, this.pixel.length * 4 * this.scale, 1 * this.scale);
        },

        /**
         *
         * @returns {*}
         */
        brightness: function () {
            return displayman.brightness();
        },

        /**
         *
         * @returns {HTMLElement|*}
         */
        current: function (fallback) {

            if (statics.SourceSettings.lighting_type != 'off') {
                var index = this.getPixelIndex();
                var color = this.getFillColor(fallback, index);

                this.canvas.ctx.clearRect(0, 0, 4 * this.pixel.length * this.scale, 1 * this.scale);

                for (var i = 0; i < this.pixel.length; i++) {
                    this.updateLight(i, color);
                    var br = this.pixel[i].brightness * statics.SourceSettings.lighting_brightness;
                    if (br) {
                        this.canvas.ctx.fillStyle = this.pixel[i].color;
                        this.canvas.ctx.globalAlpha = br;
                        this.canvas.ctx.fillRect(i * 4 * this.scale + index * this.scale, 0, 1 * this.scale, 1 * this.scale);
                    }
                }

            } else {
                this.canvas.ctx.clearRect(0, 0, 4 * this.pixel.length * this.scale, 1 * this.scale);
            }

            return this.canvas;
        },

        /**
         *
         * @param i
         * @returns {*}
         */
        updateLight: function (i, color) {

            var speed = beatkeeper.getSpeed(statics.SourceSettings.lighting_speed);
            var redo = speed.prc == 0;
            var m = this.lighting_type;

            if (redo && i == 0 && statics.SourceSettings.lighting_type == 'randomall'
                && statics.shuffle.counter >= statics.ControlSettings.shuffle_switch_every - 1) {

                var k = Object.keys(statics.SourceValues.lighting_type);
                var c = randomInt(1, k.length - 2);
                this.lighting_type = k[c];
            }

            if (m.match(redo && /^all/)) {
                this.pixel[i].brightness = 1.0;
                this.pixel[i].color = color;

            } else if (redo && m.match(/^shuffle/)) {
                var on = randomInt(0, this.pixel.length, false) > this.pixel.length / 1.5;
                this.pixel[i].brightness = on ? 1.0 : 0.0;
                this.pixel[i].color = color;

            } else if (m.match(/^wave/)) {
                var p = i / this.pixel.length;
                var d = Math.abs(p - speed.prc);
                var v = 0.25 - Math.min(d, 0.25);
                this.pixel[i].brightness = v / 0.25;
                this.pixel[i].color = color;

            } else if (m.match(/^randomblitz/)) {
                if (redo && this.pixel[i].brightness == 0.0) {
                    var on = randomInt(0, this.pixel.length, false) > this.pixel.length / 1.5;
                    this.pixel[i].brightness = on ? 1.0 : 0.0;

                } else if (this.pixel[i].brightness > 0.0) {
                    this.pixel[i].brightness = Math.max(0.0, 1.0 - speed.prc * 2);
                }

                this.pixel[i].color = color;

            } else if (m.match(/^randomoneon/)) {
                if (redo && i == 0) {
                    for (var f = 0; f < this.pixel.length; f++) {
                        this.pixel[f].brightness = 0.0;
                    }
                    var n = randomInt(0, this.pixel.length - 1, false);
                    this.pixel[n].brightness = 1.0;
                }
                if (this.pixel[i].brightness > 0.0) {
                    this.pixel[i].color = color;
                }

            } else if (m.match(/^strobemodulo/)) {

                if (redo && this.pixel[i].brightness == 0.0) {
                    if (i == 0) {
                        this._strobeModuloOdd = !this._strobeModuloOdd;
                    }
                    if ((this._strobeModuloOdd && i % 2 == 1) || (!this._strobeModuloOdd && i % 2 == 0)) {
                        this.pixel[i].brightness = 1.0;
                        this.pixel[i].color = color;
                    }

                } else if (this.pixel[i].brightness > 0.0) {
                    this.pixel[i].brightness = Math.max(0.0, 1.0 - speed.prc * 2);
                }
            }

        },

        /**
         *
         * @param fallback
         * @param index
         * @returns {*}
         */
        getFillColor: function (fallback, index) {
            var color = fallback && fallback._color ? fallback._color : '#ff0000';
            var lc = statics.SourceSettings.lighting_color;

            if (index > 0) {
                color = '#ffffff';

            } else if (lc == 'red') {
                color = '#ff0000';

            } else if (lc == 'green') {
                color = '#00ff00';

            } else if (lc == 'blue') {
                color = '#0000ff';

            } else if (lc == 'cyan') {
                color = 'cyan';

            } else if (lc == 'magenta') {
                color = 'magenta';

            } else if (lc == 'yellow') {
                color = 'yellow';

            } else if (lc == 'complementary') {
                color = hslToHex(hslComplementary(hexToHsl(color)));

            } else if (lc == 'hsl') {
                color = hslToHex({h: 180, s: 100, l: 50}, false);

            }

            return color;
        },

        /**
         *
         * @returns {number}
         */
        getPixelIndex: function () {
            var m = this.lighting_type;

            if (m.match(/amber$/)) {
                return 1;

            } else if (m.match(/white$/)) {
                return 2;

            } else if (m.match(/uv$/)) {
                return 3;

            }

            return 0;
        }

    };

}());