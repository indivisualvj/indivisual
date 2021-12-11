/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {DisplaySourcePlugin} from "../DisplaySourcePlugin";
import {Shape} from "../../animation/Shape";

class Sequence extends DisplaySourcePlugin
{
    static index = 10;

    _index;

    /**
     *
     * @type {string}
     */
    type = 'sequence';

    /**
     * @type {Sample}
     */
    sample;

    /**
     *
     * @type {number}
     */
    counter = 0;
    /**
     *
     * @type {number}
     */
    start = 0;
    /**
     *
     * @type {number}
     */
    end = 0;
    /**
     *
     * @type {number}
     */
    length = 0;
    /**
     *
     * @type {boolean}
     */
    speedup = false;
    /**
     *
     * @type {boolean}
     */
    speeddown = false;
    /**
     *
     * @type {boolean}
     */
    passthrough = false;
    /**
     *
     * @type {number}
     */
    speed = 1;
    /**
     *
     * @type {number}
     */
    velocity = 1.0;
    /**
     *
     * @type {number}
     */
    peak = 1;
    /**
     *
     * @type {{}}
     */
    oscillators = {};

    /**
     *
     * @type {number}
     */
    pointer = 0;
    /**
     *
     * @type {number}
     */
    floatPointer = 0.0;
    /**
     *
     * @type {boolean}
     */
    dirty = true;

    /**
     *
     * @param sourceManager
     * @param config
     */
    static boot(sourceManager, config) {
        if (!IS_CONTROLLER) {
            config.getEventManager().register(EVENT_SOURCE_SETTING_CHANGED, 'sequence', (data) => {
                let item = data[0];
                let display = data[2];

                if (display && item.startsWith('sequence')) {
                    let seq = HC.numberExtract(item, 'sequence');

                    if (item.match(/^sequence\d+_input$/)) {
                        sourceManager.updatePluginNrSource('sequence', seq);

                    } else {
                        sourceManager.updatePluginNr('sequence', seq);
                    }
                }
            });
        }
    }

    /**
     *
     * @param index
     */
    init(index) {
        this._index = index;
        this.id = this.type + index;
        this.canvas = new OffscreenCanvas(1, 1);
        this.canvas.id = this.id;
        this.canvas.ctx = this.canvas.getContext('2d');
        this.counter = 0;
        this.start = 0;
        this.end = 0;
        this.length = 0;
        this.speedup = false;
        this.speeddown = false;
        this.passthrough = false;
        this.speed = 1;
        this.velocity = 1.0;
        this.peak = 1;
        this.oscillators = {};
        this.loadOscillators();
    }

    getIndex() {
        return this._index;
    }

    /**
     *
     * @param width
     * @param height
     */
    update(width, height) {
        this.jump = this.config.SourceSettings[this.id + '_jump'];
        this.audio = this.config.SourceSettings[this.id + '_audio'];
        this.reversed = this.config.SourceSettings[this.id + '_reversed'];
        this.speedup = this.config.SourceSettings[this.id + '_speedup'];
        this.speeddown = this.config.SourceSettings[this.id + '_speeddown'];
        this.speed = this.config.SourceSettings[this.id + '_speed'];
        this.passthrough = this.config.SourceSettings[this.id + '_passthrough'];
        this.flipx = (this.config.SourceSettings[this.id + '_flipx']) ? -1 : 1;
        this.flipy = (this.config.SourceSettings[this.id + '_flipy']) ? -1 : 1;
        this.flipa = (this.config.SourceSettings[this.id + '_flipa']);

        this.osci = this.config.SourceSettings[this.id + '_osci'];
        this._brightness = this.config.SourceSettings[this.id + '_brightness'];
        this.blendmode = this.config.SourceValues.blendmode[this.config.SourceSettings[this.id + '_blendmode']];

        this.width = Math.round(width);
        this.height = Math.round(height);
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if (this.sample) {
            let start = this.config.SourceSettings[this.id + '_start'];
            let end = this.config.SourceSettings[this.id + '_end'];

            let needsUpdate = start !== this.start || end !== this.end
                || this.width !== this.sample.width || this.height !== this.sample.height;

            if (needsUpdate) {
                let os = this.start;
                let oe = this.end;
                let frameCount = this.sample.frameCount;

                applySequenceSlice(this, frameCount, start, end);

                if (os !== this.start) {
                    this.pointer = this.start;
                    this.counter = 0;

                } else if (oe !== this.end && this.pointer > this.end) {
                    this.pointer = this.start;
                    this.counter = 0;
                }

                this.dirty = true;
            }
        }

        let overlay = this.getOverlayNr();
        if (overlay >= 0) {
            this.overlay = this.sourceManager.getSourcePlugin('sequence', overlay);

        } else {
            this.overlay = false;
        }
    }

    /**
     *
     */
    updateSource() {
        let smp = (this.config.SourceSettings[this.id + '_input']);
        this.sample = this.sourceManager.getSample(smp);

        let type = [0, 0, 1];
        if (this.sample) {
            if (this.sample.isReady()) {
                type[1] = this.sample.frameCount - 1; // max
                type[2] = round(this.sample.frameCount / 50, 0); // precision

                // controller needs to know...
                this._emitSourceType(getSequenceStartKey(this.getIndex()), getSequenceEndKey(this.getIndex()), type, type);

            } else {
                this.config.getEventManager().register(EVENT_SAMPLE_READY, this.id, (target) => {
                    if (this.sample && this.sample.id === target.id) {
                        this.config.getEventManager().removeEventId(EVENT_SAMPLE_READY, this.id);
                        this.updateSource();
                    }
                });
            }
        }

        this.config.getEventManager().register(EVENT_SAMPLE_STATUS_CHANGED, this.id, (target) => {
            if (this.sample && this.sample.id === target.id) {
                this.animation.updateSource(getSequenceSampleKey(this.getIndex()), 'off', true, true);
            }
        });

        this.animation.updateSource(getSequenceStartKey(this.getIndex()), 0, false, true);
        this.animation.updateSource(getSequenceEndKey(this.getIndex()), type[1], true, true);
    }

    _emitSourceType(startKey, endKey, start, end) {
        let conf = {};
        conf[startKey] = start;
        conf[endKey] = end;
        this.config.getMessaging().emitData('SourceTypes', conf);
    }

    /**
     *
     * @returns {number}
     */
    getOverlayNr() {
        return parseInt(this.config.SourceSettings[this.id + '_overlay']);
    }

    /**
     *
     * @returns {number}
     */
    brightness() {
        let v = this._brightness;

        if (this.dirty) {
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

        if (this._last !== this.animation.now) {

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
                if (this.pointer >= this.end) {
                    this.pointer = this.start;

                } else if (this.pointer < this.start) {
                    this.pointer = this.end - 1;
                }
            }

            // autoflip flipa flip on peak if random hits
            if (this.flipa && this.audioAnalyser.peak && randomBool()) {
                this.flipx = randomBool() ? -1 : 1;
                this.flipy = randomBool() ? -1 : 1;
            }

            this.dirty = true;

            this._last = this.animation.now;
        }
    }

    /**
     *
     * @returns {number}
     */
    getPointer() {
        let pointer = Math.round(this.pointer);
        if (this.reversed) {
            let ds = pointer - this.start;
            pointer = this.end - ds;
        }

        if (this.dirty) {
            let prc = Math.min(100, ((pointer-this.start) / this.length) * 100);
            if (Math.ceil(prc) % 2 === 0) {
                this.config.getMessaging().emitAttr('#' + this.id, 'data-progress', prc);
            }
        }

        return pointer;
    }

    /**
     *
     * @param fallback
     * @param passthrough
     * @returns {*}
     */
    current(fallback, passthrough) {

        this.next(this.beatKeeper.getDefaultSpeed());

        let image = fallback;
        if (this.sample) {
            let frame = this.sample.getFrame(this.getPointer());

            image = frame || fallback;

        }

        if (this.dirty && image) {

            this._draw(this, image);

            if (this.overlay && this.overlay !== this && this.overlay.overlay !== this) {
                let oimage = this.overlay.current((passthrough || this.overlay.passthrough) ? fallback : false);
                this._overlay(this.overlay, oimage, this.blendmode);
            }
            image = this.canvas;
            this.dirty = false;

        } else if (!this.dirty) {
            image = this.canvas;
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
            let ctx = this.canvas.ctx;
            let br = instance.brightness();

            if (!this.width || !this.height) {
                this.width = Math.round(image.width);
                this.height = Math.round(image.height);
                this.canvas.width = this.width;
                this.canvas.height = this.height;
            }

            this.canvas._color = image._color;
            ctx.clearRect(0, 0, this.width, this.height);

            if (br > 0) {
                ctx.globalCompositeOperation = 'source-over';

                if (this.config.DisplaySettings.transparency < 1) {
                    ctx.globalAlpha = 1.0 - this.config.DisplaySettings.transparency;
                    ctx.fillRect(0, 0, this.width, this.height);
                }

                ctx.globalAlpha = br;

                let flipx = instance.flipx;
                let flipy = instance.flipy;
                let flipped = false;
                if (flipx !== 1) {
                    flipped = true;
                    ctx.scale(flipx, 1);
                }
                if (flipy !== 1) {
                    flipped = true;
                    ctx.scale(1, flipy);
                }
                if (image.width !== this.width || image.height !== this.height) {
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
                let ctx = this.canvas.ctx;
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
        let fd = dur / sample.frameCount;
        let ms = fd * this.length;
        dur /= sample.beats;
        let beats = Math.max(0.25, Math.round(ms / dur));
        //if (beat.starting()) {
        //    listener.fireEventId('sequence.next.progress', this.id, this);
        //}

        let prcb = speed;
        if (this.speedup) {
            prcb = this.beatKeeper.getSpeed('eight');

        } else if (this.speeddown) {
            prcb = this.beatKeeper.getSpeed('half');
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
        this.pointer = this.start + Math.ceil(p);
    }

    /**
     *
     * @param beat
     * @private
     */
    _raceonpeak(beat) {

        let s = Math.max(-0.75, Math.min(0.75, this.speed));
        let p = Math.max(-1.5, Math.min(1.5, this.speed));

        if (this.audioAnalyser.peak) {
            if (this.velocity < 2 * s) {
                this.velocity = 4 * s;
            }

        } else if (this.velocity > s) {
            this.velocity = Math.max(s, this.velocity - this.animation.diff * 0.03 * s);
        }

        p = p * this.velocity;
        this.floatPointer += p;
        this.pointer = Math.round(this.floatPointer);

        // safety first
        if (this.pointer < this.start) {
            this.pointer += this.length;
            this.floatPointer = this.pointer;

        } else if (this.pointer >= this.end) {
            this.pointer -= this.length;
            this.floatPointer = this.pointer;
        }
    }

    /**
     *
     * @param beat
     * @private
     */
    _jump(beat) {
        let sample = this.sample;
        let frame = sample.samples[this.pointer];
        this.pointer++;

        if (this.speedup) {
            beat = this.beatKeeper.getSpeed('sixteen');

        } else if (this.speeddown) {
            beat = this.beatKeeper.getSpeed('full');
        }

        while (frame && frame.prc < beat.prc) {
            if (this.pointer >= this.end) {
                this.pointer = this.start;
                break;
            }
            frame = sample.samples[this.pointer++];
        }
    }

    /**
     *
     * @param beat
     * @private
     */
    _audio(beat) {

        //let p = audio.volume - 0.25;

        let p = (this.audioAnalyser.volume - 0.28) * 10;
        p = Math.min(1, Math.max(-1, p)); // kann aktuell stocken. wäre evtl was für jump+audio oder audio_judder

        if (this.jump) {
            if (this.audioAnalyser.peak && this.peak < 4) {
                this.peak = 8;

            } else if (this.peak > 1) {
                this.peak = Math.max(1, this.peak - this.animation.diff * 0.05);

            }
            p = Math.round(p * this.peak);

        } else {
            p = Math.round(p);
        }

        if (this.speedup) {
            p = this.jump ? 2 : 1;

        } else if (this.speeddown) {
            p = this.jump ? -2 : -1;
        }

        p = this.speed * p;

        this.pointer += Math.round(this.speed * (p === 0 ? -1 : p));

        if (this.pointer < this.start) {
            this.pointer += this.length;

        } else if (this.pointer >= this.end) {
            this.pointer -= this.length;
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

            let instance = new HC.plugins[plugin][key]();
            instance.construct(this.animation, this, {}, plugin, key);
            instance.inject(Shape);

            this.oscillators[key] = instance;
        }
    }

    /**
     * OscillatePlugin workaround...
     */
    currentSpeed() {
        return this.beatKeeper.getSpeed('half');
    }
}

export {Sequence};
