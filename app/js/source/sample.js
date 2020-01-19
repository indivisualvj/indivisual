(function () {
    /**
     * todo ES6
     * @param index
     * @constructor
     */
    HC.Sample = function (index) {
        this.index = index;
        this.id = 'sample' + index;
        this.enabled = false;
        this.record = false;
        this.pointer = 0;
        this.initialized = false;
        this.initializing = false;
        this.started = false;
        this.complete = false;
        this.counter = 0;
        this.frames = false;
        this.length = 0;
        this.beats = 4;
    };

    HC.Sample.prototype = {

        /**
         *
         * @param speed
         * @param width
         * @param height
         */
        update: function (speed, width, height) {
            var enabled = statics.SourceSettings[getSampleEnabledKey(this.index)];
            var record = statics.SourceSettings[getSampleRecordKey(this.index)];
            var beats = statics.SourceSettings[getSampleBeatKey(this.index)];

            var checkEnabled = this.enabled != enabled;
            var checkBeats = this.beats != beats;
            var checkFrames = (!this.frames) || this.frames.length == 0;
            var checkWidth = this.width != width;
            var checkHeight = this.height != height;

            var needsUpdate = checkBeats || checkFrames || checkWidth || checkHeight;

            this.speed = speed;
            this.width = width;
            this.height = height;
            this.enabled = enabled;
            this.record = record;
            this.beats = beats;

            if (!record && checkEnabled && enabled && needsUpdate) {
                this._init(speed);

            } else if (!enabled) {
                this._init(speed, true);
                listener.fireEventId('sample.init.reset', this.id, this);
            }

        },

        /**
         *
         * @returns {boolean|*}
         */
        isReady: function () {
            return this.enabled && this.initialized && this.complete && this.frames;
        },

        /**
         *
         * @param i
         * @returns {*}
         */
        getFrame: function (i) {
            if (this.isReady() && i > -1 && i < this.frames.length) {
                return this.frames[i];
            }

            return false;
        },

        /**
         *
         * @param speed
         * @param reset
         * @private
         */
        _init: function (speed, reset) {
            this.initializing = false;
            this.initialized = false;
            this.pointer = 0;
            this.started = false;
            this.complete = false;
            this.counter = 0;
            this._clip = false;
            if (reset || !this.frames) { // performance sparen
                this.frames = [];
            }
            if (!reset) {
                this.duration = Math.ceil(60000 / speed);
                this.length = this.beats * this.duration;

                var fps = statics.DisplaySettings.fps * 1.25;
                var frames = IS_MONITOR ? 0 : Math.ceil(this.length / 1000 * fps);

                this.__init(frames);
            }
        },

        /**
         *
         * @param frames
         * @private
         */
        __init: function (frames) {
            var inst = this;

            if (this.frames.length > frames) {
                this.frames.splice(frames, this.frames.length - frames);
            }

            this.frameCount = frames;
            animation.powersave = true;

            var _init = function (i) {
                if (inst.initializing) {
                    var cv = document.createElement('canvas');
                    cv.id = inst.id + '_' + i;
                    cv.ctx = cv.getContext('2d');
                    inst.frames.push(cv);

                    cv.width = inst.width;
                    cv.height = inst.height;
                    cv.ctx.fillStyle = '#000000';
                    cv.ctx.fillRect(0, 0, cv.width, cv.height);
                    if (i % 10 == 0) {
                        inst.pointer = i;
                        listener.fireEventId('sample.init.progress', inst.id, inst);
                        animation.powersave = true;
                    }

                    i++;
                    if (inst.initializing && i < frames) {
                        setTimeout(function () {
                            requestAnimationFrame(function () {
                                _init(i);
                            });
                        }, animation.threadTimeout(.125));

                    } else {
                        inst.initialized = true;
                        inst.pointer = 0;
                        animation.powersave = false;
                        listener.fireEventId('sample.init.end', inst.id, inst);
                    }
                }
            };

            requestAnimationFrame(function () {
                listener.fireEventId('sample.init.start', inst.id, inst);
                inst.initializing = true;
                _init(0);
            });
        },

        /**
         *
         */
        finish: function () {

            if (this.pointer < this.frames.length / 2) {
                this.started = false;
                this.pointer = 0;
                this.counter = 0;

                listener.fireEventId('sample.render.error', this.id, this);

            } else {
                this.frames.splice(this.pointer, this.frames.length - this.pointer);
                this.complete = true;
                this.record = false;
                this.pointer = 0;
                this.length = this.frames.length / 60 * 1000;
                this.counter = 0;

                listener.fireEventId('sample.render.end', this.id, this);

            }
        },

        /**
         *
         * @param callback
         * @returns {boolean|*}
         */
        clip: function (callback) {
            if (!this._clip) {
                var inst = this;
                inst._clip = {id: inst.id, ready: false, thumbs: [], frames: 0, beats: 0, duration: 0};

                var file = filePath(SAMPLE_DIR, inst.id);

                messaging.files(file, function (files) {

                    var loaded = 0;
                    var frameCount = files.length;
                    var step = frameCount / 16;
                    var seconds = frameCount / 60;
                    inst._clip.frames = frameCount;
                    inst._clip.duration = Math.ceil(60000 / statics.ControlSettings.tempo);
                    inst._clip.beats = Math.ceil(seconds * 1000 / inst._clip.duration);

                    var index = 0;

                    for (var i = 0; i < frameCount; i += step) {
                        var ri = Math.floor(i);
                        var file = files[ri];
                        file = filePath(SAMPLE_DIR, inst.id, ri + '.png');
                        var image = new Image();
                        image.src = file;
                        image._index = index++;

                        inst._clip.thumbs[image._index] = image;

                        image.onerror = function () {
                            //frameCount--;
                        };
                        image.onload = function () {

                            // inst._clip.thumbs[this._index] = this;
                            loaded += step; // see if next will bee too much
                            if (loaded >= frameCount) {
                                inst._clip.ready = true;
                                callback(inst);
                            }
                        };
                    }
                });
            }
            return this._clip;
        },

        /**
         *
         * @param name
         * @param speed
         * @param width
         * @param height
         */
        load: function (name, width, height) {

            this.width = width;
            this.height = height;

            var file = filePath(SAMPLE_DIR, name);
            var loaded = 0;
            var inst = this;

            messaging._emit({action: 'files', file: file}, function (files) {

                var frameCount = files.length;
                var seconds = frameCount / 60;
                inst.enabled = true;
                inst.initialized = true;
                inst.duration = Math.ceil(60000 / statics.ControlSettings.tempo);
                inst.beats = Math.ceil(seconds * 1000 / inst.duration);

                inst.frameCount = frameCount;
                inst.frames = [];

                for (var i = 0; i < frameCount; i++) {
                    var file = files[i];
                    file = filePath(SAMPLE_DIR, name, i + '.png');
                    var image = new Image();
                    inst.frames.push(image);
                    image.src = file;
                    image._index = i;

                    image.onerror = function () {
                        frameCount--;
                    };
                    image.onload = function () {

                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        ctx.drawImage(this, 0, 0, this.width, this.height);

                        inst.frames[this._index] = canvas;

                        loaded++;
                        inst.pointer = loaded;
                        if (loaded % 10 == 0) {
                            listener.fireEventId('sample.load.progress', inst.id, inst);
                        }
                        if (loaded == frameCount) {
                            inst.finish();
                            listener.fireEventId('sample.load.end', inst.id, inst);
                        }
                    };
                }
            });
        },

        /**
         *
         * @param image
         * @param speed
         * @param color
         */
        render: function (image, speed, color) {

            renderSample(this, image, speed, color);

        },

        /**
         *
         */
        reset: function () {

        },

        /**
         *
         * @returns {number}
         */
        last: function () {
            if (this.frames && this.frames.length > 0) {
                return this.frames.length - 1;
            }

            return 0;
        }
    };

}());