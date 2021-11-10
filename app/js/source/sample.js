/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Sample}
     */
    HC.Sample = class Sample {

        index;
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

        // /**
        //  * @type {Array.<OffscreenCanvas>}
        //  */
        // frames = [];

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
         * @type {HC.Program}
         */
        program;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         * @type {HC.Listener}
         */
        listener;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         * @type {HC.SourceManager}
         */
        sourceManager;

        /**
         * @type {HC.Renderer}
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
         *
         * @param {HC.Program} program
         * @param index
         */
        constructor(program, index) {
            this.program = program;
            this.beatKeeper = program.beatKeeper;
            this.sourceManager = program.sourceManager;
            this.renderer = program.sourceManager.renderer;
            this.listener = program.listener;
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
            let checkBeats = this.beats !== beats;
            // let checkFrames = this.frames.length === 0;
            // let checkWidth = this.canvas.width !== width;
            // let checkHeight = this.canvas.height !== height;

            // let needsUpdate = checkBeats || checkFrames;// || checkWidth || checkHeight;

            this.enabled = enabled;
            // this.speed = tempo;
            this.canvas.width = width;
            this.canvas.height = height;
            this.record = record;
            this.beats = beats;

            if (!record && checkEnabled && enabled) {
                this._init(tempo);//, needsUpdate);

            } else if (!enabled) {
                this._reset();
                // this.listener.fireEventId('sample.init.reset', this.id, this);
            } else if (record) {
                if (!this.started) {
                    this.listener.register(EVENT_SOURCE_MANAGER_RENDER, this.id, (data) => {
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
            this.listener.removeEventId(EVENT_RENDERER_RENDER, this.id, this);
            this.initialized = false;
            this.pointer = 0;
            this.started = false;
            this.complete = false;
            this.counter = 0;
            this._clip = false;
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
            let frameCount = Math.ceil(this.length / 1000 * fps);
            this.frameCount = frameCount;

            this.listener.fireEventId('sample.init.start', this.id, this);

            // let loops = 0;
            // let divider = 1;
            // for (let i = 0; i < this.frameCount; i++) {
            //     this.listener.register(EVENT_RENDERER_RENDER, this.id, (data) => {
                //     if (loops % divider === 0) {
                // if (this.frames.length < this.frameCount) {
                //     let frame = this._createFrame(this.pointer);
                //     this._resetFrame(frame);
                //     this.frames.push(frame);
                //
                //     this.pointer++;
                //
                // } else if (needsUpdate && this.pointer < this.frameCount) {
                //     let frame = this.frames[this.pointer];
                //     this._resetFrame(frame);
                //     this.pointer++;
                //
                // } else {
                    this.initialized = true;
                //     this.pointer = 0;
                //     this.listener.remove(EVENT_RENDERER_RENDER, this.id);
                    this.listener.fireEventId('sample.init.end', this.id, this);
                    // break;
                // }

                // if (this.pointer % 10 === 0) {
                //     this.listener.fireEventId('sample.init.progress', this.id, this);
                // }
            // }
            // divider = Math.ceil(this.config.DisplaySettings.fps / this.program.fps);
            // loops++;
            // });

        }

        /**
         *
         * @param index
         * @returns {OffscreenCanvas}
         * @private
         */
        // _createFrame(index) {
        //     let frame = new OffscreenCanvas(1, 1);
        //     frame.index = index;
        //     frame.id = this.id + '_' + index;
        //     frame.ctx = frame.getContext('2d');
        //
        //     return frame;
        // }

        /**
         *
         * @param frame
         * @private
         */
        // _resizeFrame(frame) {
        //     frame.width = this.canvas.width;
        //     frame.height = this.canvas.height;
        // }

        /**
         *
         * @param frame
         * @private
         */
        // _resetFrame(frame) {
        //     this._resizeFrame(frame);
        //
        //     requestAnimationFrame(() => {
        //         frame.ctx.clearRect(0, 0, frame.width, frame.height);
        //     });
        // }

        /**
         *
         */
        finish() {

            this.listener.removeEventId(EVENT_SOURCE_MANAGER_RENDER, this.id);

            if (this.pointer < this.frameCount / 2) {
                this.started = false;
                this.pointer = 0;
                this.counter = 0;

                this.listener.fireEventId('sample.render.error', this.id, this);

            } else {
                this.samples.splice(this.pointer);
                this.complete = true;
                this.record = false;
                this.frameCount = this.pointer;
                this.length = this.frameCount / 60 * 1000;
                this.pointer = 0;
                this.counter = 0;
                this.listener.fireEventId('sample.render.end', this.id, this);
                this.listener.fireEvent(EVENT_SAMPLE_READY, this);
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
                        this.listener.fireEventId('sample.render.start', sample.id, sample);
                        sample.started = true;
                    }
                }
                if (sample.started) {
                    if (speed.starting()) {
                        if (sample.counter >= sample.beats) {
                            sample.finish();

                        } else {
                            sample.counter++;
                            this.listener.fireEventId('sample.render.progress', sample.id, sample);
                        }

                    }
                    if (!sample.complete) {
                        let target = this.canvas;//sample.frames[sample.pointer];
                        // if (target && target.ctx) {
                            let ctx = this.context;//target.ctx;
                            ctx.drawImage(image, 0, 0);
                            target = target.transferToImageBitmap();
                            target._color = color;
                            target.progress = sample.counter + speed.prc;
                            target.prc = speed.prc;

                            sample.samples[sample.pointer] = target;

                            sample.pointer++;
                        // }
                    }
                }
            } else {
                this.listener.fireEventId('sample.render.error', sample.id, sample);
            }

        }

        /**
         *
         */
        reset() {

        }

        /**
         *
         * @returns {number}
         */
        last() {
            return Math.max(0, this.frameCount - 1);
        }
    }
}
