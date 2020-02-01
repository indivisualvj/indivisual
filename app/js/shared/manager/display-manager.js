/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.DisplayManager}
     */
    HC.DisplayManager = class DisplayManager {

        settings = {
            visibility: {
                index: 0,
                random: false
            },
            border: {
                random: false
            }
        };

        /**
         * @type {HC.Animation}
         */
        animation;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         * @type {HC.Renderer}
         */
        renderer;

        /**
         * @type {HC.AudioAnalyser}
         */
        audioAnalyser;

        /**
         * @param {HC.Animation} animation
         * @param config
         */
        constructor(animation, config) {
            this.animation = animation;
            this.config = animation.config;
            this.beatKeeper = animation.beatKeeper;
            this.renderer = animation.renderer;
            this.audioAnalyser = animation.audioAnalyser;
            this.displays = config.display;
            this.width = 1280;
            this.height = 720;
            this.displayMap = [];
            this.maptastic = this.initMaptastic();
            this.cliptastic = this.initCliptastic();
            this.mappingTimeouts = [];

            this.initBorderModePlugins();
        }

        /**
         *
         */
        initBorderModePlugins() {
            for (let k in HC.Display.border_modes) {
                let plugin = HC.Display.border_modes[k];
                plugin = new plugin(this);
                HC.Display.border_modes[k] = plugin;
                plugin.init();
            }
        }

        /**
         *
         */
        initMaptastic() {
            let self = this;
            return Maptastic({
                crosshairs: true,
                autoSave: false,
                autoLoad: false,
                original: {width: this.width, height: this.height},
                onchange(e) {
                    if (e && 'element' in e) {
                        let element = e.element;
                        let id = element.id;
                        let mapping = {
                            //sourcePoints: e.sourcePoints,
                            targetPoints: e.targetPoints
                        };
                        self.onMapping(id, mapping);
                    }
                }
            });
        }

        /**
         *
         * @param id
         * @param mapping
         */
        onMapping(id, mapping) {
            if (this.mappingTimeouts[id]) {
                clearTimeout(this.mappingTimeouts[id]);
            }
            if (this.animation) {
                let f = (id, mapping) => {
                    this.mappingTimeouts[id] = setTimeout(() => {
                        this.animation.updateDisplay(id + '_mapping', JSON.stringify(mapping), false, true, false);
                        this.mappingTimeouts[id] = false;
                    }, 125);
                };
                f(id, mapping);
            }
        }

        /**
         *
         */
        initCliptastic() {

            let maskTimeouts = [];
            let onMask = (id, mask) => {
                if (maskTimeouts[id]) {
                    clearTimeout(maskTimeouts[id]);
                }
                if (this.animation) {
                    let f = (id, mask) => {
                        maskTimeouts[id] = setTimeout(() => {
                            this.animation.updateDisplay(id, JSON.stringify(mask), true, true, false);
                            maskTimeouts[id] = false;
                        }, 125);
                    };
                    f(id, mask);
                }
            };
            return Cliptastic({
                onchange: (e) => {
                    if (e && 'element' in e) {
                        let element = e.element;
                        let id = element.id;
                        let mask = {
                            points: e.element.points
                        };
                        onMask(id, mask);
                    }
                }
            });
        }

        /**
         *
         * @param display
         * @param enable
         */
        enableMaptastic(display, enable) {
            if (display) {
                let canvas = display.canvas;
                if (enable) {
                    let points = display.loadMapping();

                    this.maptastic.addLayer(canvas, points.targetPoints, points.sourcePoints);

                    if (!points.targetPoints) {
                        this.centerDisplay(display.index, 1, true, false);
                    }

                } else {
                    this.maptastic.removeLayer(canvas);
                    canvas.style.transform = '';
                    canvas.style.transformOrigin = '';

                    let px = 0.5;
                    let py = 0.5;
                    let cx = px * window.innerWidth;
                    let cy = py * window.innerHeight;
                    let sw = canvas.width;
                    let sh = canvas.height;
                    let ml = cx - sw / 2;
                    let mt = cy - sh / 2;
                    canvas.style.left = ml + 'px';
                    canvas.style.top = mt + 'px';
                }

                this.cliptastic.refresh();
            }
        }

        /**
         *
         * @param display
         * @param enable
         */
        enableCliptastic(display, enable) {
            if (display && display.mask) {
                let mask = display.mask;
                if (enable) {
                    display.loadMask();
                    this.cliptastic.addLayer(mask);

                } else {
                    this.cliptastic.removeLayer(mask);
                }
            }
        }

        /**
         *
         */
        refreshCliptastic() {
            this.cliptastic.refresh();
        }

        /**
         *
         * @param v
         */
        brightness(v) {
            if (v !== undefined) {
                for (let i = 0; i < this.displays.length; i++) {
                    if (this.displays[i]) {
                        this.displays[i].ctx.globalAlpha = Math.min(1, v);
                    }
                }
            }

            return Math.min(1, this.config.DisplaySettings.brightness);
        }

        /**
         *
         * @param i
         * @returns {*}
         */
        getDisplay(i) {
            let visible = this.config.DisplaySettings['display' + i + '_visible'];
            if (visible) {
                if (!this.displays[i]) {
                    this.displays[i] = new HC.Display(this.animation, i);
                    this._addDisplay(i);

                    if (IS_SETUP) {
                        if (i == 0) {
                            if (this.shapetastic) {
                                this.shapetastic.destroy();
                            }
                            this.shapetastic = Shapetastic(this.displays[i]);

                        } else {
                            this.displays[i].canvas.style.pointerEvents = 'none';
                        }
                    }
                }

            } else {
                this._removeDisplay(i);
            }

            return this.displays[i];
        }

        /**
         *
         * @param i
         * @param mode
         */
        updateDisplay(i, mode) {
            let display = this.getDisplay(i);
            if (display) {
                display.update(this.width, this.height, this.config.DisplaySettings);

                if (!mode) {
                    this.animation.sourceManager.updateSource(display);
                    this.enableCliptastic(display, false);
                    display.updateMask();
                    this.enableCliptastic(display, !display.isFixedSize());
                    display.updateClip();
                    this.enableMaptastic(display, true);

                } else {
                    switch (mode) {
                        case 'mask':
                        case 'mapping':
                            display.loadMask();
                            display.updateClip();
                            this.refreshCliptastic();
                            this.enableMaptastic(display, true);
                            break;
                    }
                }
            }

            this.updateDisplayMap();
        }

        /**
         *
         * @param i
         * @private
         */
        _addDisplay(i) {
            let display = this.getDisplay(i);
            if (display) {
                document.body.appendChild(display.canvas);
            }
        }

        /**
         *
         * @param i
         * @private
         */
        _removeDisplay(i) {
            if (this.displays[i]) {
                let display = this.displays[i];
                this.enableMaptastic(display, false);
                this.enableCliptastic(display, false);
                document.body.removeChild(display.canvas);
                this.displays[i] = false;
            }
        }

        /**
         *
         */
        updateDisplayMap() {
            this.displayMap = [];
            let index = 0;
            for (let i = 0; i < this.displays.length; i++) {
                if (this.displays[i]) {
                    if (!this.displays[i].static) {
                        this.displayMap.push(i);
                    }
                    this.displays[i].index = index++;
                }
            }
        }

        /**
         *
         * @param i
         * @param factor
         * @param screen
         * @param notify
         * @returns {*}
         */
        centerDisplay(i, factor, screen, notify) {
            let display = this.getDisplay(i);
            if (display) {
                return this.maptastic.centerByElement(display.canvas, factor, screen, notify);
            }

            return false;
        }

        /**
         *
         */
        render() {
            this.renderDisplays();
        }

        /**
         *
         * @param display
         * @param speed
         * @param mode
         */
        renderBorder(display, speed, mode) {
            if (this.config.DisplaySettings.border && !display.noborder) {
                let lw = this.config.DisplaySettings.border * 1;
                let color = this.config.DisplaySettings.border_color;

                if (color == '') {
                    let canvas = display.getSource() ? display.getSource().current() : false;
                    color = (canvas && canvas._color) ? canvas._color : this.renderer.currentLayer.shapeColor(false);
                }

                display.drawBorder(lw, color, mode, speed);

            }
        }

        /**
         *
         * @param width
         * @param height
         * @param resolution
         */
        resize(resolution) {
            this.width = resolution.x;
            this.height = resolution.y;
            this.maptastic.resize(resolution);
            this.updateDisplays();
        }

        /**
         *
         */
        reset() {
            this.updateDisplays();
        }

        /**
         *
         */
        updateDisplays() {

            document.body.style.backgroundColor = this.config.DisplaySettings.background;

            for (let i = 0; i < this.displays.length; i++) {
                this.updateDisplay(i, false);
            }
        }

        /**
         *
         */
        updateMasks() {
            for (let i = 0; i < this.displays.length; i++) {
                if (this.displays[i]) {
                    let display = this.displays[i];
                    if (display && display.mask) {
                        display.mask.update();
                    }
                }
            }
        }

        /**
         *
         */
        renderDisplays() {
            let visibleIndex = 0;
            let fallback = this.renderer.current();

            for (let i = 0; i < this.displays.length; i++) {
                let display = this.displays[i];
                if (display && !display.offline) {
                    this._handleVisible(display, visibleIndex++);

                    if (display.visible) {
                        display.render(fallback);

                    } else {
                        display.clear();
                    }

                    let bm = this.settings.border.random !== false
                        ? this.settings.border.random
                        : this.config.DisplaySettings.border_mode;

                    switch (bm) {
                        case 'parent':
                            if (display.visible) {
                                this.renderBorder(display, false, bm);
                            }
                            break;

                        default:
                            this.renderBorder(display, this.borderSpeed(), bm);
                            break;
                    }
                }
            }
            this.config.DisplaySettings.trigger_display_visibility = false;
            this.config.DisplaySettings.force_display_visibility = false;
            this.config.DisplaySettings.reset_display_visibility = false;
        }

        /**
         *
         * @param display
         * @param index
         * @private
         */
        _handleVisible(display, index) {
            let redo = false;
            if (!display.static) {
                redo = this._visibilityMode(index, display.visible);

            } else {
                redo = 1;
            }

            switch (redo) {
                case 0:
                    display.visible = false;
                    break;

                case 1:
                    display.visible = true;
                    break;

                case 2:
                    display.visible = randomInt(0, 3) > 0 ? true : this.config.DisplaySettings.force_display_visibility;
                    break;

                case 3: // flash
                    display.visible = randomBool() ? true : this.config.DisplaySettings.force_display_visibility;
                    break;

                case 4: // flash timeout
                    if (display.visible === true) {
                        display.visible = this.flashTimeoutInFrames(this.config.DisplaySettings.display_speed);

                    } else {
                        display.visible--;
                    }
                    break;

                //case -3:
                //    break;

                case -4:
                    display.smear = (randomBool()) ? true : this.config.DisplaySettings.force_display_visibility;
                    display.visible = true;
                    break;

                case -5:
                    display.blitz = (randomBool()
                        || this.config.DisplaySettings.force_display_visibility) ? 4 : 0;
                    display.visible = true;
                    break;
            }

            // undo _freezemode
            switch (redo) {
                case -3:
                    display.smear = false;
                    display.blitz = 0;
                    break;
                case -4:
                    display.blitz = 0;
                    break;
                case -5:
                    display.smear = false;
                    break;
                case -2:
                case false:
                    break;

                default:
                    display.smear = false;
                    break;
            }
            display.blitz--;
        }

        /**
         *
         * @param index
         * @param visible
         * @returns {boolean}
         */
        _visibilityMode(index, visible) {
            let redo = false;

            let speed = this.visibilitySpeed();
            let sv = this.settings.visibility.random !== false
                ? this.settings.visibility.random : this.config.DisplaySettings.display_visibility;

            if (this.config.DisplaySettings.reset_display_visibility) {
                sv = 'visible';
            }

            switch (sv) {
                case 'random':
                    if ((speed === false && this.audioAnalyser.peak) || speed === 0) {
                        redo = 2;
                    }
                    break;

                case 'randomoneon':
                    if ((speed === false && this.audioAnalyser.peak) || speed === 0) {
                        if (index == 0) {
                            this.settings.visibility.index = randomInt(0, this.displayMap.length - 1);
                        }
                    }
                    redo = this.settings.visibility.index == index ? 1 : 0;
                    break;

                case 'randomoneoff':
                    if ((speed === false && this.audioAnalyser.peak) || speed === 0) {
                        if (index == 0) {
                            this.settings.visibility.index = randomInt(0, this.displayMap.length - 1);
                        }
                    }
                    redo = this.settings.visibility.index == index ? 0 : 1;
                    break;

                case 'randomflash':
                    if (!visible && ((speed === false && this.audioAnalyser.peak) || speed === 0)) {
                        redo = 3;

                    } else if (visible) {
                        redo = 4;

                    } else {
                        redo = 0;
                    }
                    break;

                case 'randomblitz':
                    if ((speed === false && this.audioAnalyser.peak) || speed === 0) {
                        redo = -5;
                    } else {
                        redo = -2;
                    }
                    break;

                case 'randomsmear':
                    if ((speed === false && this.audioAnalyser.peak) || speed === 0) {
                        redo = -4;
                    } else {
                        redo = -2;
                    }
                    break;
                    break;

                case 'stackf': //stack forward
                    var percentile = 1 / (this.displayMap.length + 1);
                    var prc = percentile * (index + 1);
                    //if (speed === false) {
                    this.visibilityStack(index, 1, speed);
                    var i = this.settings.visibility.index + 2;
                    speed = i * percentile;
                    //}
                    if (speed > prc) {
                        redo = 1;
                    } else {
                        redo = 0;
                    }
                    break;

                case 'stackr': // stack reversed
                    var percentile = 1 / (this.displayMap.length);
                    var prc = percentile * (index);
                    //if (speed === false) {
                    this.visibilityStack(index, 1, speed);
                    var i = this.settings.visibility.index;
                    speed = i * percentile;
                    //}
                    if (1 - speed > prc) {
                        redo = 1;
                    } else {
                        redo = 0;
                    }
                    break;

                case 'stackoof': // stack one off forward
                    this.visibilityStack(index, 1, speed);
                    var i = this.settings.visibility.index;
                    if (index == i) {
                        redo = 0;
                    } else {
                        redo = 1;
                    }
                    break;

                case 'stackoor': // stack one off reversed
                    this.visibilityStack(index, -1, speed);
                    var i = this.settings.visibility.index;
                    if (index == i) {
                        redo = 0;
                    } else {
                        redo = 1;
                    }
                    break;

                case 'hidden':
                    redo = 0;
                    break;

                case 'visible':
                    redo = 1;
                    break;

                default:
                    redo = !visible;
                    break;
            }

            return redo;
        }

        /**
         *
         * @returns {boolean}
         */
        visibilitySpeed() {
            let speed = false;
            let ds = this.config.DisplaySettings.display_speed;
            if (ds == 'midi') {
                if (this.config.DisplaySettings.trigger_display_visibility
                    || this.config.DisplaySettings.force_display_visibility
                ) {
                    speed = {prc: 0};

                } else {
                    speed = {prc: 1};
                }

            } else if (ds == 'layer') {
                if (this.renderer.layerSwitched) {
                    speed = {prc: 0};
                    this.config.DisplaySettings.force_display_visibility = true;

                } else {
                    speed = {prc: 1};
                }

            } else {
                speed = this.beatKeeper.getSpeed(ds);
            }

            if (speed) {
                return speed.prc;

            } else {
                return false;
            }
        }

        /**
         *
         * @returns {boolean}
         */
        borderSpeed() {
            let speed = this.beatKeeper.getSpeed(this.config.DisplaySettings.border_speed);
            return speed;
        }

        /**
         *
         * @param index
         * @param dir
         * @param speed
         */
        visibilityStack(index, dir, speed) {

            if (index == 0 && ((speed === false && this.audioAnalyser.peak) || speed === 0)) {

                let i = this.settings.visibility.index;

                i += dir;

                if (i >= this.displayMap.length) {
                    i = 0;

                } else if (i < 0) {
                    i = this.displayMap.length - 1;
                }

                this.settings.visibility.index = i;
            }
        }

        /**
         *
         * @param speed
         * @returns {number}
         */
        flashTimeoutInFrames(speed) {
            let timeout = this.beatKeeper.getSpeed(speed).duration / 2;
            let count = Math.round((timeout / this.animation.duration) / 2);
            return count;
        }

    }
}
