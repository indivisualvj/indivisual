/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Sequence}
     */
    HC.Sequence = class Sequence {

        /**
         *
         * @param index
         */
        constructor(index) {
            this.type = 'sequence';
            this.index = index;
            this.id = this.type + this.index;
            this._pointer = 0;
            this._floatPointer = 0.0;
            this._dirty = true;
            this._canvas = document.createElement('canvas');
            this._canvas.id = this.id;
            this._ctx = this._canvas.getContext('2d');
            this.counter = 0;
            this.start = 0;
            this.end = 0;
            this.length = 0;
            this.speedup = false;
            this.speeddown = false;
            this.passthrough = false;
            this.speed = 1;
            this._velocity = 1.0;
            this._peak = 1;
            this.oscillators = {};
            this.loadOscillators();
        }

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds(reference) {
            return reference;
        }

        /**
         *
         * @param width
         * @param height
         */
        update(width, height) {
            this.jump = statics.SourceSettings[this.id + '_jump'];
            this.audio = statics.SourceSettings[this.id + '_audio'];
            this.reversed = statics.SourceSettings[this.id + '_reversed'];
            this.speedup = statics.SourceSettings[this.id + '_speedup'];
            this.speeddown = statics.SourceSettings[this.id + '_speeddown'];
            this.speed = statics.SourceSettings[this.id + '_speed'];
            this.passthrough = statics.SourceSettings[this.id + '_passthrough'];
            this.flipx = (statics.SourceSettings[this.id + '_flipx']) ? -1 : 1;
            this.flipy = (statics.SourceSettings[this.id + '_flipy']) ? -1 : 1;
            this.flipa = (statics.SourceSettings[this.id + '_flipa']);

            let osci = statics.SourceSettings[this.id + '_osci'];
            this.osci = osci;

            let brightness = statics.SourceSettings[this.id + '_brightness'];
            this._brightness = brightness;

            let blendmode = statics.SourceValues.blendmode[statics.SourceSettings[this.id + '_blendmode']];
            this.blendmode = blendmode;

            this.width = Math.round(width);
            this.height = Math.round(height);
            this._canvas.width = this.width;
            this._canvas.height = this.height;

            if (this.sample) {
                let start = statics.SourceSettings[this.id + '_start'];
                let end = statics.SourceSettings[this.id + '_end'];

                let needsUpdate = start != this.start || end != this.end
                    || this.width != this.sample.width || this.height != this.sample.height;

                if (needsUpdate) {

                    let os = this.start;
                    let oe = this.end;
                    let frames = this.sample.frames.length;
                    applySequenceSlice(this, frames, start, end);

                    if (os != this.start) {
                        this._pointer = this.start;
                        this.counter = 0;

                    } else if (oe != this.end && this._pointer > this.end) {
                        this._pointer = this.start;
                        this.counter = 0;
                    }

                    this._dirty = true;
                }
            }
        }

        /**
         *
         * @returns {number}
         */
        brightness() {
            let v = this._brightness;

            if (this._dirty) {
                let plugin = this.oscillators[this.osci];
                if (plugin && plugin.apply) {
                    let shs = {value: v};
                    plugin.store(shs);
                    plugin.apply(shs);
                    v = Math.abs(shs.value);
                    plugin.restore(shs);
                }
            }

            return v;
        }

        /**
         *
         * @param speed
         */
        next(speed) {

            if (this._last != animation.now) {

                let sample = this.sample;

                if (sample && sample.isReady()) {

                    // sample race on peak
                    if (this.audio && this.jump) {
                        this._raceonpeak(speed);

                        // sample audio
                    } else if (this.audio) {
                        this._audio(speed);

                        // sample jump
                    } else if (this.jump) {
                        this._jump(speed);

                    } else {
                        this._progress(speed);
                    }

                    // safety first
                    if (this._pointer >= this.end) {
                        this._pointer = this.start;

                    } else if (this._pointer < this.start) {
                        this._pointer = this.end - 1;
                    }

                }

                // autoflip flipa flip on peak if random hits
                if (this.flipa && audio.peak && randomBool()) {
                    this.flipx = randomBool() ? -1 : 1;
                    this.flipy = randomBool() ? -1 : 1;
                }

                this._dirty = true;

                this._last = animation.now;
            }
        }

        /**
         *
         * @returns {number}
         */
        pointer() {
            if (this.reversed) {
                let ds = this._pointer - this.start;
                return this.end - ds;
            }

            return Math.round(this._pointer);
        }

        /**
         *
         * @param fallback
         * @param passthrough
         * @returns {*}
         */
        current(fallback, passthrough) {

            this.next(beatKeeper.getDefaultSpeed());

            let image = fallback;
            if (this.sample) {
                let frame = this.sample.getFrame(this.pointer());

                image = frame || fallback;

            }

            if (this._dirty && image) {

                this._draw(this, image);

                if (this.overlay && this.overlay != this && this.overlay.overlay != this) {
                    let oimage = this.overlay.current((passthrough || this.overlay.passthrough) ? fallback : false);
                    this._overlay(this.overlay, oimage, this.blendmode);
                }
                image = this._canvas;
                this._dirty = false;

            } else if (!this._dirty) {
                image = this._canvas;
            }

            return image;
        }

        /**
         *
         * @param instance
         * @param image
         * @private
         */
        _draw(instance, image) {

            if (image) {
                let ctx = this._ctx;
                let br = instance.brightness();

                if (!this.width || !this.height) {
                    this.width = Math.round(image.width);
                    this.height = Math.round(image.height);
                    this._canvas.width = this.width;
                    this._canvas.height = this.height;
                }

                this._canvas._color = image._color;
                ctx.clearRect(0, 0, this.width, this.height);

                if (br > 0) {
                    ctx.globalCompositeOperation = 'source-over';

                    if (statics.DisplaySettings.transparency < 1) {
                        ctx.globalAlpha = 1.0 - statics.DisplaySettings.transparency;
                        ctx.fillRect(0, 0, this.width, this.height);
                    }

                    ctx.globalAlpha = br;

                    let flipx = instance.flipx;
                    let flipy = instance.flipy;
                    let flipped = false;
                    if (flipx != 1) {
                        flipped = true;
                        ctx.scale(flipx, 1);
                    }
                    if (flipy != 1) {
                        flipped = true;
                        ctx.scale(1, flipy);
                    }
                    if (image.width != this.width || image.height != this.height) {
                        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.width * flipx, this.height * flipy);

                    } else {
                        ctx.drawImage(image, 0, 0, image.width * flipx, image.height * flipy);
                    }

                    if (flipped) {
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                    }
                }
            }
        }

        /**
         *
         * @param instance
         * @param image
         * @param blendmode
         * @private
         */
        _overlay(instance, image, blendmode) {
            if (image) {
                let br = instance.passthrough ? 1 : instance.brightness();
                if (br > 0) {
                    let ctx = this._ctx;
                    ctx.globalAlpha = br;
                    ctx.globalCompositeOperation = blendmode ? blendmode : 'source-over';
                    ctx.drawImage(image, 0, 0, image.width, image.height);//, 0, 0, this.width, this.height);
                }
            }
        }

        /**
         *
         * @param speed
         * @private
         */
        _progress(speed) {
            let sample = this.sample;
            let dur = sample.duration;
            let fd = dur / sample.frames.length;
            let ms = fd * this.length;
            dur /= sample.beats;
            let beats = Math.max(0.25, Math.round(ms / dur));
            //if (beat.starting()) {
            //    listener.fireEventId('sequence.next.progress', this.id, this);
            //}

            let prcb = speed;
            if (this.speedup) {
                prcb = beatKeeper.getSpeed('eight');

            } else if (this.speeddown) {
                prcb = beatKeeper.getSpeed('half');
            }

            if (prcb.starting()) {
                this.counter++;
                if (this.counter >= beats) {
                    this.counter = 0;
                }
            }

            let eprc = this.counter + prcb.prc;
            let prc = eprc / beats;
            let p = this.length * prc;
            this._pointer = this.start + Math.ceil(p);
        }

        /**
         *
         * @param beat
         * @private
         */
        _raceonpeak(beat) {

            let s = Math.max(-0.75, Math.min(0.75, this.speed));
            let p = Math.max(-1.5, Math.min(1.5, this.speed));

            if (audio.peak) {
                if (this._velocity < 2 * s) {
                    this._velocity = 4 * s;
                }

            } else if (this._velocity > s) {
                this._velocity = Math.max(s, this._velocity - animation.diff * 0.03 * s);
            }

            p = p * this._velocity;
            this._floatPointer += p;
            this._pointer = Math.round(this._floatPointer);

            // safety first
            if (this._pointer < this.start) {
                this._pointer += this.length;
                this._floatPointer = this._pointer;

            } else if (this._pointer >= this.end) {
                this._pointer -= this.length;
                this._floatPointer = this._pointer;
            }
        }

        /**
         *
         * @param beat
         * @private
         */
        _jump(beat) {
            let sample = this.sample;
            let frame = sample.frames[this._pointer];
            this._pointer++;

            if (this.speedup) {
                beat = beatKeeper.getSpeed('sixteen');

            } else if (this.speeddown) {
                beat = beatKeeper.getSpeed('full');
            }

            while (frame && frame.prc < beat.prc) {
                if (this._pointer >= this.end) {
                    this._pointer = this.start;
                    break;
                }
                frame = sample.frames[this._pointer++];
            }
        }

        /**
         *
         * @param beat
         * @private
         */
        _audio(beat) {

            //let p = audio.volume - 0.25;

            let p = (audio.volume - 0.28) * 10;
            p = Math.min(1, Math.max(-1, p)); // kann aktuell stocken. wäre evtl was für jump+audio oder audio_judder

            if (this.jump) {
                if (audio.peak && this._peak < 4) {
                    this._peak = 8;

                } else if (this._peak > 1) {
                    this._peak = Math.max(1, this._peak - animation.diff * 0.05);

                }
                p = Math.round(p * this._peak);

            } else {
                p = Math.round(p);
            }

            if (this.speedup) {
                p = this.jump ? 2 : 1;

            } else if (this.speeddown) {
                p = this.jump ? -2 : -1;
            }

            p = this.speed * p;

            this._pointer += this.speed * (p == 0 ? -1 : p);

            if (this._pointer < this.start) {
                this._pointer += this.length;

            } else if (this._pointer >= this.end) {
                this._pointer -= this.length;
            }
        }

        /**
         *
         */
        loadOscillators() {

            let plugin = 'oscillate';
            let items = HC.plugins[plugin];

            this.oscillators[plugin] = this.oscillators[plugin] || {};

            let keys = Object.keys(items);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];

                let instance = new HC.plugins[plugin][key](this);
                instance.construct(this, {}, plugin, key);
                instance.inject();

                this.oscillators[key] = instance;
            }
        }

        /**
         * OscillatePlugin workaround...
         */
        getCurrentSpeed() {
            return beatKeeper.getSpeed('half');
        }
    }
}
