/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {EventManager} from "../manager/EventManager";

class Sample {

    /**
     * @type {number}
     */
    index;

    /**
     * @type {number}
     */
    id;

    /**
     *
     * @type {boolean}
     */
    enabled = false;

    /**
     *
     * @type {boolean}
     */
    record = false;

    /**
     *
     * @type {number}
     */
    pointer = 0;

    /**
     *
     * @type {boolean}
     */
    initialized = false;

    /**
     *
     * @type {boolean}
     */
    started = false;

    /**
     *
     * @type {boolean}
     */
    complete = false;

    /**
     *
     * @type {number}
     */
    counter = 0;

    /**
     * @type {Array.<ImageBitmap>}
     */
    samples = [];

    /**
     *
     * @type {number}
     */
    length = 0;

    /**
     *
     * @type {number}
     */
    beats = 4;

    /**
     * @type {Program}
     */
    program;

    /**
     * @type {Config}
     */
    config;

    /**
     * @type {BeatKeeper}
     */
    beatKeeper;

    /**
     * @type {SourceManager}
     */
    sourceManager;

    /**
     * @type {Renderer}
     */
    renderer;

    /**
     * @type {OffscreenCanvas}
     */
    canvas;

    /**
     * @type {OffscreenCanvasRenderingContext2D}
     */
    context;

    /**
     * @type {Clip}
     */
    clip;

    /**
     *
     * @param {Program} program
     * @param index
     */
    constructor(program, index) {
        this.program = program;
        this.beatKeeper = program.beatKeeper;
        this.sourceManager = program.sourceManager;
        this.renderer = program.sourceManager.renderer;
        this.config = program.config;
        this.index = index;
        this.id = 'sample' + index;

        this.canvas = new OffscreenCanvas(1, 1);
        this.context = this.canvas.getContext('2d');
    }

    /**
     *
     * @param tempo
     * @param width
     * @param height
     */
    update(tempo, width, height) {
        let enabled = this.config.SourceSettings[getSampleEnabledKey(this.index)];
        let record = this.config.SourceSettings[getSampleRecordKey(this.index)];
        let beats = this.config.SourceSettings[getSampleBeatKey(this.index)];

        let checkEnabled = this.enabled !== enabled;
        this.enabled = enabled;
        this.canvas.width = width;
        this.canvas.height = height;
        this.record = record;
        this.beats = beats;

        if (!record && checkEnabled && enabled) {
            this._init(tempo);

        } else if (!enabled) {
            this._reset();

        } else if (record) {
            if (!this.started) {
                EventManager.register(EVENT_SOURCE_MANAGER_RENDER, this.id, (sourceManager) => {
                    let speed = this.beatKeeper.getDefaultSpeed();
                    this.render(this.renderer.current(), speed, this.renderer.currentColor());
                });
            }
        }

    }

    /**
     *
     * @returns {boolean|*}
     */
    isReady() {
        return this.enabled && this.initialized && this.complete && this.samples.length;
    }

    /**
     *
     * @param i
     * @returns {*}
     */
    getFrame(i) {
        if (this.isReady() && i > -1 && i < this.frameCount) {
            return this.samples[i];
        }

        return false;
    }

    /**
     *
     * @private
     */
    _reset() {
        EventManager.removeEventId(EVENT_RENDERER_BEFORE_RENDER, this.id, this);
        this.initialized = false;
        this.pointer = 0;
        this.started = false;
        this.complete = false;
        this.counter = 0;
        this.clip = null;

        for (const sample of this.samples) {
            sample.close();
        }

        this.samples = [];
    }

    /**
     *
     * @param tempo
     * @param needsUpdate
     * @private
     */
    _init(tempo, needsUpdate) {

        this._reset();

        this.duration = Math.ceil(60000 / tempo);
        this.length = this.beats * this.duration;

        let fps = this.config.DisplaySettings.fps * 1.15;
        this.frameCount = Math.ceil(this.length / 1000 * fps);
        this.initialized = true;
        EventManager.fireEventId(EVENT_SAMPLE_INIT_END, this.id, this);

    }

    /**
     *
     */
    finish() {

        EventManager.removeEventId(EVENT_SOURCE_MANAGER_RENDER, this.id);

        if (this.pointer < this.frameCount / 2) {
            this.started = false;
            this.pointer = 0;
            this.counter = 0;

            EventManager.fireEventId(EVENT_SAMPLE_RENDER_ERROR, this.id, this);

        } else {
            this.samples.splice(this.pointer);
            this.complete = true;
            this.record = false;
            this.frameCount = this.pointer;
            this.length = this.frameCount / 60 * 1000;
            this.pointer = 0;
            this.counter = 0;
            EventManager.fireEventId(EVENT_SAMPLE_RENDER_END, this.id, this);
            EventManager.fireEvent(EVENT_SAMPLE_READY, this);
        }
    }

    /**
     *
     * @param image
     * @param speed
     * @param color
     */
    render(image, speed, color) {

        let sample = this;
        if (image && sample.samples) {
            if (!sample.started) {
                if (speed.starting()) {
                    EventManager.fireEventId(EVENT_SAMPLE_RENDER_START, sample.id, sample);
                    sample.started = true;
                }
            }
            if (sample.started) {
                if (speed.starting()) {
                    if (sample.counter >= sample.beats) {
                        sample.finish();

                    } else {
                        sample.counter++;
                        EventManager.fireEventId(EVENT_SAMPLE_RENDER_PROGRESS, sample.id, sample);
                    }

                }
                if (!sample.complete) {
                    let ctx = this.context;
                    ctx.drawImage(image, 0, 0);
                    let target = this.canvas.transferToImageBitmap();
                    target._color = color;
                    target.progress = sample.counter + speed.prc;
                    target.prc = speed.prc;

                    sample.samples[sample.pointer] = target;

                    sample.pointer++;
                }
            }
        } else {
            EventManager.fireEventId(EVENT_SAMPLE_RENDER_ERROR, sample.id, sample);
        }

    }

    /**
     *
     * @returns {number}
     */
    last() {
        return Math.max(0, this.frameCount - 1);
    }


    /**
     *
     * @returns {Clip}
     */
    getClip() {
        return this.clip;
    }

    /**
     *
     * @param value
     */
    setClip(value) {
        this.clip = value;
    }
}

class Clip {

    /**
     * @type {number}
     */
    id;

    /**
     *
     * @type {boolean}
     */
    ready = false

    /**
     *
     * @type {[]}
     */
    thumbs = [];

    /**
     *
     * @type {number}
     */
    length = 0;

    /**
     *
     * @type {number}
     */
    beats = 0;

    /**
     *
     * @type {number}
     */
    duration = 0;

    /**
     *
     * @param id {number}
     */
    constructor(id) {
        this.id = id;
    }

    reset() {
        this.thumbs = [];
    }

}

export {Sample, Clip}