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

        /**
         * @type {[]}
         */
        frames = [];
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
        animation;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         * @type {HC.Listener}
         */
        listener;

        /**
         *
         * @param {HC.Program} animation
         * @param index
         */
        constructor(animation, index) {
            this.animation = animation;
            this.listener = animation.listener;
            this.config = animation.config;
            this.index = index;
            this.id = 'sample' + index;
        }

        /**
         *
         * @param speed
         * @param width
         * @param height
         */
        update(speed, width, height) {
            let enabled = this.config.SourceSettings[getSampleEnabledKey(this.index)];
            let record = this.config.SourceSettings[getSampleRecordKey(this.index)];
            let beats = this.config.SourceSettings[getSampleBeatKey(this.index)];

            let checkEnabled = this.enabled != enabled;
            let checkBeats = this.beats != beats;
            let checkFrames = this.frames.length == 0;
            let checkWidth = this.width != width;
            let checkHeight = this.height != height;

            let needsUpdate = checkBeats || checkFrames || checkWidth || checkHeight;

            this.speed = speed;
            this.width = width;
            this.height = height;
            this.enabled = enabled;
            this.record = record;
            this.beats = beats;

            if (!record && checkEnabled && enabled) {
                this._init(speed, needsUpdate);

            } else if (!enabled) {
                this._reset();
                this.listener.fireEventId('sample.init.reset', this.id, this);
            }

        }

        /**
         *
         * @returns {boolean|*}
         */
        isReady() {
            return this.enabled && this.initialized && this.complete && this.frames;
        }

        /**
         *
         * @param i
         * @returns {*}
         */
        getFrame(i) {
            if (this.isReady() && i > -1 && i < this.frameCount) {
                return this.frames[i];
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
         * @param speed
         * @param needsUpdate
         * @private
         */
        _init(speed, needsUpdate) {

            this._reset();

            this.duration = Math.ceil(60000 / speed);
            this.length = this.beats * this.duration;

            let fps = this.config.DisplaySettings.fps * 1.15;
            let frames = IS_MONITOR ? 0 : Math.ceil(this.length / 1000 * fps); // fixme no init if monitor oida!

            this.frameCount = frames;

            this.listener.fireEventId('sample.init.start', this.id, this);

            this.listener.register(EVENT_RENDERER_RENDER, this.id, (data) => {
                if (this.frames.length < this.frameCount) {
                    let frame = this._createFrame(this.pointer);
                    this._resetFrame(frame);
                    this.frames.push(frame);

                    if (this.pointer % 10 == 0) {
                        this.listener.fireEventId('sample.init.progress', this.id, this);
                    }

                    this.pointer++;

                } else if (needsUpdate && this.pointer < this.frameCount) {
                    let frame = this.frames[this.pointer];
                    this._resetFrame(frame);
                    this.pointer++;

                } else {
                    this.initialized = true;
                    this.pointer = 0;
                    this.listener.fireEventId('sample.init.end', this.id, this);
                    this.listener.remove(EVENT_RENDERER_RENDER, this.id);
                }
            });
        }

        /**
         *
         * @param index
         * @returns {HTMLCanvasElement}
         * @private
         */
        _createFrame(index) {
            let frame = document.createElement('canvas');
            frame.id = this.id + '_' + index;
            frame.ctx = frame.getContext('2d');

            return frame;
        }

        /**
         *
         * @param frame
         * @private
         */
        _resetFrame(frame) {
            frame.width = this.width;
            frame.height = this.height;
            frame.ctx.fillStyle = '#000000';
            frame.ctx.fillRect(0, 0, this.width, this.height);
        }

        /**
         *
         * @param frames
         * @private
         */
        __init(frames) {



        }

        /**
         *
         */
        finish() {

            if (this.pointer < this.frameCount / 2) {
                this.started = false;
                this.pointer = 0;
                this.counter = 0;

                this.listener.fireEventId('sample.render.error', this.id, this);

            } else {
                this.complete = true;
                this.record = false;
                this.frameCount = this.pointer;
                this.length = this.frameCount / 60 * 1000;
                this.pointer = 0;
                this.counter = 0;
// fixme do slow gc after render if no one else is in the queue
                this.listener.fireEventId('sample.render.end', this.id, this);

            }
        }

        /**
         *
         * @param callback
         * @returns {boolean|*}
         */
        clip(callback) {
            if (!this._clip) {
                this._clip = {id: this.id, ready: false, thumbs: [], frames: 0, beats: 0, duration: 0};

                let file = filePath(SAMPLE_DIR, this.id);

                messaging.files(file, (files) => {

                    let loaded = 0;
                    let frameCount = files.length;
                    let step = frameCount / 16;
                    let seconds = frameCount / 60;
                    this._clip.frames = frameCount;
                    this._clip.duration = Math.ceil(60000 / this.config.ControlSettings.tempo);
                    this._clip.beats = Math.ceil(seconds * 1000 / this._clip.duration);

                    let index = 0;

                    for (let i = 0; i < frameCount; i += step) {
                        let ri = Math.floor(i);
                        let file = files[ri];
                        file = filePath(SAMPLE_DIR, this.id, ri + '.png');
                        let image = new Image();
                        image.src = file;
                        image._index = index++;

                        this._clip.thumbs[image._index] = image;

                        image.onerror = () => {
                            //frameCount--;
                        };
                        image.onload = () => {

                            // this._clip.thumbs[this._index] = this;
                            loaded += step; // see if next will bee too much
                            if (loaded >= frameCount) {
                                this._clip.ready = true;
                                callback(this);
                            }
                        };
                    }
                });
            }
            return this._clip;
        }

        /**
         *
         * @param name
         * @param width
         * @param height
         */
        load(name, width, height) {

            this.width = width;
            this.height = height;

            let file = filePath(SAMPLE_DIR, name);
            let loaded = 0;

            messaging._emit({action: 'files', file: file}, (files) => {

                let frameCount = files.length;
                let seconds = frameCount / 60;
                this.enabled = true;
                this.initialized = true;
                this.duration = Math.ceil(60000 / this.config.ControlSettings.tempo);
                this.beats = Math.ceil(seconds * 1000 / this.duration);

                this.frameCount = frameCount;
                this.frames = [];

                for (let i = 0; i < frameCount; i++) {
                    let file = files[i];
                    file = filePath(SAMPLE_DIR, name, i + '.png');
                    let image = new Image();
                    this.frames.push(image);
                    image.src = file;
                    image._index = i;

                    image.onerror = () => {
                        frameCount--;
                    };
                    image.onload = () => {

                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        ctx.drawImage(image, 0, 0, image.width, image.height);

                        this.frames[image._index] = canvas;

                        loaded++;
                        this.pointer = loaded;
                        if (loaded % 10 == 0) {
                            this.listener.fireEventId('sample.load.progress', this.id, this);
                        }
                        if (loaded == frameCount) {
                            this.finish();
                            this.listener.fireEventId('sample.load.end', this.id, this);
                        }
                    };
                }
            });
        }

        /**
         *
         * @param image
         * @param speed
         * @param color
         */
        render(image, speed, color) {

            let sample = this;
            if (image && sample.frames) {
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
                        let target = sample.frames[sample.pointer++];
                        if (target && target.ctx) {
                            target._color = color;
                            target.progress = sample.counter + speed.prc;
                            target.prc = speed.prc;
                            let ctx = target.ctx;
                            ctx.clearRect(0, 0, sample.width, sample.height);
                            ctx.drawImage(image, 0, 0);
                        }
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
