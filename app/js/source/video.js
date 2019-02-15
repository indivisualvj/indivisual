(function () {
    /**
     *
     * @param index
     * @param file
     * @constructor
     */
    HC.Video = function (index, file) {
        this.index = index;
        this.id = 'sample' + index;
        this.file = file;
        this.reset();
    };

    HC.Video.prototype = {

        /**
         *
         * @param speed
         * @param width
         * @param height
         */
        update: function (speed, width, height) {

            this.speed = speed;
            this.width = width;
            this.height = height;

            if (!this.canvas) {
                this.init();
            }

            var dx = (this._width - this.width) / 2;
            var dy = (this._height - this.height) / 2;
            var w = Math.min(this.width, this._width);
            var h = Math.min(this.height, this._height);
            this.readArea = new HC.Rectangle(Math.max(0, dx), Math.max(0, dy), w, h);
            this.writeArea = new HC.Rectangle(Math.max(0, dx * -1), Math.max(0, dy * -1), w, h);
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
         */
        init: function () {
            var file = this.file;
            var tag = document.createElement('video');
            tag.visible = true;
            tag.id = this.id;
            var source = document.createElement('source');

            tag.setAttribute('muted', '');
            tag.preload = 'auto';

            source.setAttribute('src', file);
            tag.appendChild(source);
            document.body.appendChild(tag);
            this.canvas = tag;

            var meta = file.replace(/^[^\d]+/, '').replace(/\..{3,4}$/, '');
            if (meta != file) {
                meta = meta.split(',');
                if (meta.length > 2) {
                    var bpm = meta[0];
                    var res = meta[1];
                    var fps = meta[2];
                    res = res.split('x');
                    this._width = parseInt(res[0]);
                    this._height = parseInt(res[1]);
                    this._speed = parseInt(bpm);
                    this.fps = parseInt(fps);

                } else {
                    this._speed = 120;
                    this._width = 1280;
                    this._height = 720;
                    this.fps = 30;
                }
            }
            this.duration = Math.ceil(60000 / this._speed);

            var inst = this;
            tag.onloadedmetadata = function () {
                var milliseconds = tag.duration * 1000;
                var frameDuration = 1000 / statics.DisplaySettings.fps;

                var maxFrames = inst.duration * 32 / 1000 * statics.DisplaySettings.fps;
                var frames = Math.min(maxFrames, Math.ceil(milliseconds / frameDuration));
                milliseconds = frameDuration * frames;
                inst.beats = Math.floor(milliseconds / inst.duration);
                inst.frames = [];
                inst._init(frames);

            };
            tag.oncanplaythrough = function () {
                inst.enabled = true;
            };
            tag.onabort = tag.onerror = function (err) {
                console.error(err);
                listener.fire('sample.render.error', this.id, this);
            }
        },

        /**
         *
         * @param frames
         * @private
         */
        _init: function (frames) {
            var inst = this;
            var _loop = function (i) {
                if (inst.initializing) {

                    if (inst.fps < 45 && i % 2 == 1) {
                        inst.frames.push(inst.frames[i - 1]);

                    } else {
                        var cv = document.createElement('canvas');
                        cv.id = inst.id + '_' + i;
                        cv.ctx = cv.getContext('2d');
                        inst.frames.push(cv);
                        cv.width = inst.width;
                        cv.height = inst.height;
                        cv.ctx.fillStyle = '#000000';
                        cv.ctx.fillRect(0, 0, cv.width, cv.height);
                    }

                    i++;
                    if (inst.initializing && i < frames) {

                        if (i % 2 == 0) {
                            _loop(i);

                        } else {
                            requestAnimationFrame(function () {
                                _loop(i);
                            });
                        }

                    } else {
                        inst.initialized = true;
                        inst.record = true;
                    }
                }
            };

            listener.fire('sample.init.start', inst.id, inst);
            requestAnimationFrame(function () {
                inst.initializing = true;
                _loop(0);
            });
        },

        /**
         *
         */
        finish: function () {
            this.canvas.pause();
            this.complete = true;
            this.pointer = 0;

            listener.fire('sample.render.end', this.id, this);
        },

        /**
         *
         * @param image
         * @param progress
         * @param color
         */
        render: function (image, progress, color) {

            //var inst = this;
            //renderSample(this, this.canvas, progress, color, function () {
            //    inst.canvas.play();
            //});

            if (this.enabled && this.initialized && !this.complete) {
                if (image && this.frames) {
                    if (!this.started) {
                        if (progress.prc == 0) {
                            //listener.fire('sample.render.start', this.id, this);
                            this.started = true;
                            this.canvas.play();
                        }
                    }
                    if (this.started) {
                        animation.powersave = true;
                        if (this.pointer >= this.frames.length) {
                            this.finish();

                        } else {
                            this.counter++;
                            //listener.fire('sample.render.progress', this.id, this);
                        }

                        if (!this.complete) {
                            var target = this.frames[this.pointer];
                            if (target) {
                                if (this.fps < 45 && this.pointer % 2 == 1) {
                                    this.frames[this.pointer] = this.frames[this.pointer - 1];

                                } else {
                                    /**
                                     * genauer aber weniger dynamik da beim rendern prc werte aus
                                     * progress bei beatkorrektur würfeln
                                     */
                                    //var frameDuration = 1000 / statics.DisplaySettings.fps;
                                    //var progress = this.pointer * frameDuration;
                                    //var allover = progress / this.duration;
                                    //var prc = allover - Math.floor(allover);

                                    target._color = color;
                                    target.progress = this.counter + progress.prc;
                                    target.prc = progress.prc;
                                    var ctx = target.ctx;
                                    ctx.clearRect(0, 0, this.width, this.height);
                                    ctx.drawImage(
                                        this.canvas,
                                        this.readArea.x, this.readArea.y, this.readArea.width, this.readArea.height,
                                        this.writeArea.x, this.writeArea.y, this.writeArea.width, this.writeArea.height
                                    );
                                    target.ctx = false;
                                }

                            }
                            this.pointer++;
                        }
                    }
                } else {
                    //listener.fire('sample.render.error', this.id, this);
                }
            }
        },

        /**
         *
         */
        reset: function () {
            this.enabled = false;
            this.pointer = 0;
            this.initialized = false;
            this.initializing = false;
            this.record = false;
            this.started = false;
            this.complete = false;
            this.frames = false;
            this.beats = 4;

            if (this.canvas) {
                document.body.removeChild(this.canvas);
            }

            this.canvas = false;
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