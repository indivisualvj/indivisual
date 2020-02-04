/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

// todo make this load itself a set of controlsets? possible?
{
    /**
     *
     * @type {HC.SourceManager.display_source.Lighting}
     */
    HC.SourceManager.display_source.lighting = class Lighting extends HC.SourceManager.DisplaySourcePlugin {

        type = 'lighting';

        /**
         *
         * @param width
         * @param height
         */
        update(width, height) {
            let pixelUpdate = this.pixel.length != this.config.SourceSettings.lighting_pattern_lights;
            let scaleUpdate = this.scale != this.config.SourceSettings.lighting_scale;
            if (pixelUpdate || scaleUpdate) {
                this.init(this.index);
            }

            this.lighting_type = this.config.SourceSettings.lighting_type;
        }

        /**
         *
         */
        init(index) {

            this.index = index;
            this.id = this.type + this.index;
            this._bounds = false;
            this.pixel = [];
            this.scale = 1;
            this.lighting_type = 'off';
            this._strobeModuloOdd = false;
            this.shuffleCounter = 0;

            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.ctx = this.canvas.getContext('2d');
                this.canvas.id = this.id;
            }

            this.scale = this.config.SourceSettings.lighting_scale;
            this.pixel = [];
            for (let i = 0; i < this.config.SourceSettings.lighting_pattern_lights; i++) {
                this.pixel[i] = {
                    brightness: 0.0,
                    color: '#ff0000'
                }
            }

            this.canvas.width = this.width = this.pixel.length * 4 * this.scale;
            this.canvas.height = this.height = 1 * this.scale;
        }

        /**
         *
         * @returns {HC.Rectangle}
         */
        bounds() {
            return new HC.Rectangle(0, 0, this.pixel.length * 4 * this.scale, 1 * this.scale);
        }

        /**
         *
         * @param fallback
         * @returns {HTMLCanvasElement}
         */
        current(fallback) {

            if (this.config.SourceSettings.lighting_type != 'off') {
                let index = this.getPixelIndex();
                let color = this.getFillColor(fallback, index);

                this.canvas.ctx.clearRect(0, 0, 4 * this.pixel.length * this.scale, 1 * this.scale);

                let speed = this.beatKeeper.getSpeed(this.config.SourceSettings.lighting_speed);
                let redo = speed.starting();
                if (redo) {
                    this.shuffleCounter++;
                }

                for (let i = 0; i < this.pixel.length; i++) {
                    this.updateLight(i, color);
                    let br = this.pixel[i].brightness * this.config.SourceSettings.lighting_brightness;
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
        }

        /**
         *
         * @param i
         * @param color
         */
        updateLight(i, color) {

            let speed = this.beatKeeper.getSpeed(this.config.SourceSettings.lighting_speed);
            let redo = speed.starting();
            let m = this.lighting_type;

            if (redo && i == 0 && this.config.SourceSettings.lighting_type == 'randomall'
                && this.shuffleCounter >= this.config.ControlSettings.shuffle_every - 1) {
                this.shuffleCounter = 0;

                let k = Object.keys(this.config.SourceValues.lighting_type);
                let c = randomInt(1, k.length - 2);
                this.lighting_type = k[c];
            }

            if (m.match(redo && /^all/)) {
                this.pixel[i].brightness = 1.0;
                this.pixel[i].color = color;

            } else if (redo && m.match(/^shuffle/)) {
                let on = randomInt(0, this.pixel.length, false) > this.pixel.length / 1.5;
                this.pixel[i].brightness = on ? 1.0 : 0.0;
                this.pixel[i].color = color;

            } else if (m.match(/^wave/)) {
                let p = i / this.pixel.length;
                let d = Math.abs(p - speed.prc);
                let v = 0.25 - Math.min(d, 0.25);
                this.pixel[i].brightness = v / 0.25;
                this.pixel[i].color = color;

            } else if (m.match(/^randomblitz/)) {
                if (redo && this.pixel[i].brightness == 0.0) {
                    let on = randomInt(0, this.pixel.length, false) > this.pixel.length / 1.5;
                    this.pixel[i].brightness = on ? 1.0 : 0.0;

                } else if (this.pixel[i].brightness > 0.0) {
                    this.pixel[i].brightness = Math.max(0.0, 1.0 - speed.prc * 2);
                }

                this.pixel[i].color = color;

            } else if (m.match(/^randomoneon/)) {
                if (redo && i == 0) {
                    for (let f = 0; f < this.pixel.length; f++) {
                        this.pixel[f].brightness = 0.0;
                    }
                    let n = randomInt(0, this.pixel.length - 1, false);
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

        }

        /**
         *
         * @param fallback
         * @param index
         * @returns {string}
         */
        getFillColor(fallback, index) {
            let color = fallback && fallback._color ? fallback._color : '#ff0000';
            let lc = this.config.SourceSettings.lighting_color;

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
        }

        /**
         *
         * @returns {number}
         */
        getPixelIndex() {
            let m = this.lighting_type;

            if (m.match(/amber$/)) {
                return 1;

            } else if (m.match(/white$/)) {
                return 2;

            } else if (m.match(/uv$/)) {
                return 3;

            }

            return 0;
        }
    }
}
