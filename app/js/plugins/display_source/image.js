/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.SourceManager.display_source.image = class Plugin extends HC.SourceManager.DisplaySourcePlugin {

        file;

        /**
         *
         * @param speed
         * @param width
         * @param height
         */
        update(speed, width, height) {

            this.speed = speed;
            this.width = width;
            this.height = height;

            if (!this.canvas) {
                this.init(this.index, this.file);
            }

            let crop = cropAtoB(this._width, this._height, this.width, this.height);
            this.readArea = crop.readArea;
            this.writeArea = crop.writeArea;
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
            if (this.isReady() && i > -1 && i < this.frames.length) {
                return this.frames[i];
            }

            return false;
        }

        /**
         *
         */
        init(index, file) {
            this.index = index;
            this.id = 'sample' + index;
            this.file = file;
            this.reset();

            let tag = document.createElement('img');
            tag.visible = true;
            tag.id = this.id;
            tag.setAttribute('src', file);

            this.canvas = tag;

            let meta = parseFileMeta(this.file);
            this._width = meta.resolution.x;
            this._height = meta.resolution.y;
            this._tempo = meta.tempo;
            this.fps = meta.fps;

            this.duration = Math.ceil(60000 / this._tempo);
            let inst = this;
            tag.onload = () => {
                inst.beats = 1;
                inst.frames = [];
                inst.enabled = true;
                inst._init(1);
            };
            tag.onabort = tag.onerror = (err) => {
                console.error(err);
                this.listener.fireEventId('sample.render.error', this.id, this);
            }
        }

        /**
         *
         * @param frames
         * @private
         */
        _init(frames) {
            let inst = this;
            let _loop = function (i) {
                if (inst.initializing) {

                    if (inst.fps < 45 && i % 2 == 1) {
                        inst.frames.push(inst.frames[i - 1]);

                    } else {
                        let cv = document.createElement('canvas');
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

            this.listener.fireEventId('sample.init.start', inst.id, inst);
            requestAnimationFrame(function () {
                inst.initializing = true;
                _loop(0);
            });
        }

        /**
         *
         */
        finish() {
            this.complete = true;
            this.pointer = 0;

            this.listener.fireEventId('sample.render.end', this.id, this);
        }

        /**
         *
         * @param image
         * @param speed
         * @param color
         */
        render(image, speed, color) {

            if (this.enabled && this.initialized && !this.complete) {
                if (this.canvas && this.frames) {
                    if (!this.started) {
                        if (speed.starting()) {
                            this.listener.fireEventId('sample.render.start', this.id, this);
                            this.started = true;
                        }
                    }
                    if (this.started) {

                        if (this.pointer >= this.frames.length) {
                            this.finish();
                        }
                        if (!this.complete) {
                            let target = this.frames[this.pointer];
                            if (target) {
                                if (this.fps < 45 && this.pointer % 2 == 1) {
                                    this.frames[this.pointer] = this.frames[this.pointer - 1];

                                } else {

                                    let frameDuration = 1000 / this.animation.config.DisplaySettings.fps;
                                    let progress = this.pointer * frameDuration;
                                    let allover = progress / this.duration;
                                    let prc = allover - Math.floor(allover);

                                    target._color = color;
                                    target.progress = allover;
                                    target.prc = prc;
                                    let ctx = target.ctx;
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
                    this.listener.fireEventId('sample.render.error', this.id, this);
                }
            }
        }

        /**
         *
         */
        reset() {
            this.enabled = false;
            this.pointer = 0;
            this.initialized = false;
            this.initializing = false;
            this.record = false;
            this.started = false;
            this.complete = false;
            this.frames = false;
            this.beats = 4;
            this.canvas = false;
        }

        /**
         *
         * @returns {number}
         */
        last() {
            if (this.frames && this.frames.length > 0) {
                return this.frames.length - 1;
            }

            return 0;
        }
    }
}
