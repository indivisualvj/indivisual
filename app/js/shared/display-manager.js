/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {
    var inst;
    HC.DisplayManager = function (config) {
        this.displays = config.display;
        this.width = 1280;
        this.height = 720;
        this.displayMap = [];
        this.maptastic = this.initMaptastic();
        this.cliptastic = this.initCliptastic();
        this.mappingTimeouts = [];
        this.maskTimeouts = [];
        inst = this;
    };

    HC.DisplayManager.prototype = {

        /**
         *
         */
        initMaptastic: function () {
            return Maptastic({
                crosshairs: true,
                autoSave: false,
                autoLoad: false,
                original: {width: this.width, height: this.height},
                onchange: function (e) {
                    if (e && 'element' in e) {
                        var element = e.element;
                        var id = element.id;
                        var mapping = {
                            //sourcePoints: e.sourcePoints,
                            targetPoints: e.targetPoints
                        };
                        inst.onMapping(id, mapping);
                    }
                }
            });
        },

        /**
         *
         * @param id
         * @param mapping
         */
        onMapping: function (id, mapping) {
            if (inst.mappingTimeouts[id]) {
                clearTimeout(inst.mappingTimeouts[id]);
            }
            if (animation) {
                var f = function (id, mapping) {
                    inst.mappingTimeouts[id] = setTimeout(function () {
                        animation.updateDisplay(id + '_mapping', JSON.stringify(mapping), false, true, false);
                        inst.mappingTimeouts[id] = false;
                    }, 125);
                };
                f(id, mapping);
            }
        },

        /**
         *
         */
        initCliptastic: function () {
            var onMask = function (id, mask) {
                if (inst.maskTimeouts[id]) {
                    clearTimeout(inst.maskTimeouts[id]);
                }
                if (animation) {
                    var f = function (id, mask) {
                        inst.maskTimeouts[id] = setTimeout(function () {
                            animation.updateDisplay(id, JSON.stringify(mask), true, true, false);
                            inst.maskTimeouts[id] = false;
                        }, 125);
                    };
                    f(id, mask);
                }
            };
            return Cliptastic({
                onchange: function (e) {
                    if (e && 'element' in e) {
                        var element = e.element;
                        var id = element.id;
                        var mask = {
                            points: e.element.points
                        };
                        onMask(id, mask);
                    }
                }
            });
        },

        /**
         *
         * @param display
         * @param enable
         */
        enableMaptastic: function (display, enable) {
            if (display) {
                var canvas = display.canvas;
                if (enable) {
                    var points = display.loadMapping();

                    this.maptastic.addLayer(canvas, points.targetPoints, points.sourcePoints);

                    if (!points.targetPoints) {
                        this.centerDisplay(display.index, 1, true, false);
                    }

                } else {
                    this.maptastic.removeLayer(canvas);
                    canvas.style.transform = '';
                    canvas.style.transformOrigin = '';

                    var px = 0.5;
                    var py = 0.5;
                    var cx = px * window.innerWidth;
                    var cy = py * window.innerHeight;
                    var sw = canvas.width;
                    var sh = canvas.height;
                    var ml = cx - sw / 2;
                    var mt = cy - sh / 2;
                    canvas.style.left = ml + 'px';
                    canvas.style.top = mt + 'px';
                }

                this.cliptastic.refresh();
            }
        },

        /**
         *
         * @param display
         * @param enable
         */
        enableCliptastic: function (display, enable) {
            if (display && display.mask) {
                var mask = display.mask;
                if (enable) {
                    display.loadMask();
                    this.cliptastic.addLayer(mask);

                } else {
                    this.cliptastic.removeLayer(mask);
                }
            }
        },

        /**
         *
         */
        refreshCliptastic: function () {
            this.cliptastic.refresh();
        },

        /**
         *
         * @param v
         */
        brightness: function (v) {
            if (v !== undefined) {
                for (var i = 0; i < this.displays.length; i++) {
                    if (this.displays[i]) {
                        this.displays[i].ctx.globalAlpha = Math.min(1, v);
                    }
                }
            }

            return Math.min(1, statics.DisplaySettings.brightness);
        },

        /**
         *
         * @param i
         * @returns {*}
         */
        getDisplay: function (i) {
            var visible = statics.DisplaySettings['display' + i + '_visible'];
            if (visible) {
                if (!this.displays[i]) {
                    this.displays[i] = new HC.Display(i);
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
        },

        /**
         *
         * @param i
         * @param mode
         */
        updateDisplay: function (i, mode) {
            var display = this.getDisplay(i);
            if (display) {
                display.update(this.width, this.height, statics.DisplaySettings);

                if (!mode) {
                    sourceman.updateSource(display);
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
        },

        _addDisplay: function (i) {
            var display = this.getDisplay(i);
            if (display) {
                document.body.appendChild(display.canvas);
            }
        },

        /**
         *
         * @param i
         */
        _removeDisplay: function (i) {
            if (this.displays[i]) {
                var display = this.displays[i];
                this.enableMaptastic(display, false);
                this.enableCliptastic(display, false);
                document.body.removeChild(display.canvas);
                this.displays[i] = false;
            }
        },

        /**
         *
         */
        updateDisplayMap: function () {
            this.displayMap = [];
            var index = 0;
            for (var i = 0; i < this.displays.length; i++) {
                if (this.displays[i]) {
                    if (!this.displays[i].static) {
                        this.displayMap.push(i);
                    }
                    this.displays[i].index = index++;
                }
            }
        },

        /**
         *
         * @param i
         * @param factor
         * @param screen
         * @param notify
         * @returns {*}
         */
        centerDisplay: function (i, factor, screen, notify) {
            var display = this.getDisplay(i);
            if (display) {
                return this.maptastic.centerByElement(display.canvas, factor, screen, notify);
            }

            return false;
        },

        /**
         *
         */
        render: function () {
            this.renderDisplays();
        },

        /**
         *
         * @param display
         * @param speed
         * @param mode
         */
        renderBorder: function (display, speed, mode) {
            if (statics.DisplaySettings.border && !display.noborder) {
                var lw = statics.DisplaySettings.border * 1;
                var color = statics.DisplaySettings.border_color;

                if (color == '') {
                    var canvas = display.getSource() ? display.getSource().current() : false;
                    color = (canvas && canvas._color) ? canvas._color : renderer.currentLayer.shapeColor(false);
                }

                display.drawBorder(lw, color, mode, speed);

            }
        },

        /**
         *
         * @param width
         * @param height
         * @param resolution
         */
        resize: function (resolution) {
            this.width = resolution.x;
            this.height = resolution.y;
            this.maptastic.resize(resolution);
            this.updateDisplays();
        },

        reset: function () {
            this.updateDisplays();
        },

        /**
         *
         */
        updateDisplays: function () {

            document.body.style.backgroundColor = statics.DisplaySettings.background;

            for (var i = 0; i < this.displays.length; i++) {
                this.updateDisplay(i, false);
            }
        },

        /**
         *
         */
        updateMasks: function () {
            for (var i = 0; i < this.displays.length; i++) {
                if (this.displays[i]) {
                    var display = this.displays[i];
                    if (display && display.mask) {
                        display.mask.update();
                    }
                }
            }
        },

        /**
         *
         */
        renderDisplays: function () {
            var visibleIndex = 0;
            var fallback = renderer.current();

            for (var i = 0; i < this.displays.length; i++) {
                var display = this.displays[i];
                if (display && !display.offline) {
                    this._handleVisible(display, visibleIndex++);

                    if (display.visible) {
                        display.render(fallback);

                    } else {
                        display.clear();
                    }

                    var bm = statics.display.border.random !== false
                        ? statics.display.border.random
                        : statics.DisplaySettings.border_mode;

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
            statics.DisplaySettings.trigger_display_visibility = false;
            statics.DisplaySettings.force_display_visibility = false;
            statics.DisplaySettings.reset_display_visibility = false;
        },

        /**
         *
         * @param display
         * @private
         */
        _handleVisible: function (display, index) {
            var redo = false;
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
                    display.visible = randomInt(0, 3) > 0 ? true : statics.DisplaySettings.force_display_visibility;
                    break;

                case 3: // flash
                    display.visible = randomBool() ? true : statics.DisplaySettings.force_display_visibility;
                    break;

                case 4: // flash timeout
                    if (display.visible === true) {
                        display.visible = this.flashTimeoutInFrames(statics.DisplaySettings.display_speed);

                    } else {
                        display.visible--;
                    }
                    break;

                //case -3:
                //    break;

                case -4:
                    display.smear = (randomBool()) ? true : statics.DisplaySettings.force_display_visibility;
                    display.visible = true;
                    break;

                case -5:
                    display.blitz = (randomBool()
                        || statics.DisplaySettings.force_display_visibility) ? 4 : 0;
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
        },

        /**
         *
         * @param index
         * @param visible
         * @returns {boolean}
         */
        _visibilityMode: function (index, visible) {
            var redo = false;

            var speed = this.visibilitySpeed();
            var sv = statics.display.visibility.random !== false
                ? statics.display.visibility.random : statics.DisplaySettings.display_visibility;

            if (statics.DisplaySettings.reset_display_visibility) {
                sv = 'visible';
            }

            switch (sv) {
                case 'random':
                    if ((speed === false && audio.peak) || speed === 0) {
                        redo = 2;
                    }
                    break;

                case 'randomoneon':
                    if ((speed === false && audio.peak) || speed === 0) {
                        if (index == 0) {
                            statics.display.visibility.index = randomInt(0, this.displayMap.length - 1);
                        }
                    }
                    redo = statics.display.visibility.index == index ? 1 : 0;
                    break;

                case 'randomoneoff':
                    if ((speed === false && audio.peak) || speed === 0) {
                        if (index == 0) {
                            statics.display.visibility.index = randomInt(0, this.displayMap.length - 1);
                        }
                    }
                    redo = statics.display.visibility.index == index ? 0 : 1;
                    break;

                case 'randomflash':
                    if (!visible && ((speed === false && audio.peak) || speed === 0)) {
                        redo = 3;

                    } else if (visible) {
                        redo = 4;

                    } else {
                        redo = 0;
                    }
                    break;

                case 'randomblitz':
                    if ((speed === false && audio.peak) || speed === 0) {
                        redo = -5;
                    } else {
                        redo = -2;
                    }
                    break;

                case 'randomsmear':
                    if ((speed === false && audio.peak) || speed === 0) {
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
                    var i = statics.display.visibility.index + 2;
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
                    var i = statics.display.visibility.index;
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
                    var i = statics.display.visibility.index;
                    if (index == i) {
                        redo = 0;
                    } else {
                        redo = 1;
                    }
                    break;

                case 'stackoor': // stack one off reversed
                    this.visibilityStack(index, -1, speed);
                    var i = statics.display.visibility.index;
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
        },

        /**
         *
         * @returns {boolean}
         */
        visibilitySpeed: function () {
            var speed = false;
            var ds = statics.DisplaySettings.display_speed;
            if (ds == 'midi') {
                if (statics.DisplaySettings.trigger_display_visibility
                    || statics.DisplaySettings.force_display_visibility
                ) {
                    speed = {prc: 0};

                } else {
                    speed = {prc: 1};
                }

            } else if (ds == 'layer') {
                if (renderer.layerSwitched) {
                    speed = {prc: 0};
                    statics.DisplaySettings.force_display_visibility = true;

                } else {
                    speed = {prc: 1};
                }

            } else {
                speed = beatkeeper.getSpeed(ds);
            }

            if (speed) {
                return speed.prc;

            } else {
                return false;
            }
        },

        /**
         *
         * @returns {boolean}
         */
        borderSpeed: function () {
            var speed = beatkeeper.getSpeed(statics.DisplaySettings.border_speed);
            return speed;
        },

        /**
         *
         * @param index
         * @param dir
         * @param speed
         */
        visibilityStack: function (index, dir, speed) {

            if (index == 0 && ((speed === false && audio.peak) || speed === 0)) {

                var i = statics.display.visibility.index;

                i += dir;

                if (i >= this.displayMap.length) {
                    i = 0;

                } else if (i < 0) {
                    i = this.displayMap.length - 1;
                }

                statics.display.visibility.index = i;
            }
        },

        /**
         *
         * @param speed
         * @returns {number}
         */
        flashTimeoutInFrames: function (speed) {
            var timeout = beatkeeper.getSpeed(speed).duration / 2;
            var count = Math.round((timeout / animation.duration) / 2);
            return count;
        }

    };
})();
