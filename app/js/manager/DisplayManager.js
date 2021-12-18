/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {EventManager} from "./EventManager";
import {Display} from "../animation/Display";
import {TimeoutManager} from "./TimeoutManager";
import {PluginManager} from "./PluginManager";
import {Shapetastic} from "../shared/Shapetastic";

class DisplayManager {

    static plugins = {};

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
     * @type {Animation}
     */
    animation;

    /**
     * @type {Config}
     */
    config;

    /**
     * @type {BeatKeeper}
     */
    beatKeeper;

    /**
     * @type {Renderer}
     */
    renderer;

    /**
     * @type {AudioAnalyser}
     */
    audioAnalyser;

    /**
     *
     * @type {boolean}
     * @private
     */
    __renderToScreen = true;

    /**
     * @param {Animation} animation
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

        PluginManager.bootPlugins(DisplayManager.plugins, this, config);
        this.initBorderModePlugins();
        this.initVisibilityModePlugins();
        this.initEvents();
    }

    /**
     *
     */
    initBorderModePlugins() {
        PluginManager.instantiatePlugins(this, DisplayManager.plugins.border_mode, {}, (plugin) => {
            plugin.init(DisplayManager.plugins.border_mode);
        });
    }


    /**
     *
     */
    initVisibilityModePlugins() {
        PluginManager.instantiatePlugins(this, DisplayManager.plugins.display_visibility, {}, (plugin) => {
            plugin.init(DisplayManager.plugins.display_visibility);
        });
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
        if (this.animation) {
            let f = (id, mapping) => {
                TimeoutManager.add('onMapping.' + id, 125, () => {
                    this.animation.updateDisplay(id + '_mapping', JSON.stringify(mapping), false, true, false);
                });
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
                this.displays[i] = new Display(i, this);
                this._addDisplay(i);

                if (IS_SETUP) {
                    if (i === 0) {
                        if (this.shapetastic) {
                            this.shapetastic.destroy();
                        }
                        this.shapetastic = Shapetastic(this.displays[i], this.animation);

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
     * @param refresh
     */
    updateDisplay(i, refresh) {
        let display = this.getDisplay(i);
        if (display) {
            display.update(this.width, this.height, this.config.DisplaySettings);

            if (!refresh) {
                this.animation.sourceManager.updateSource(display);
                this.enableCliptastic(display, false);
                display.updateMask();
                this.enableCliptastic(display, true);
                this.enableMaptastic(display, true);

            } else {
                display.loadMask();
                this.refreshCliptastic();
                this.enableMaptastic(display, true);
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
            let display = this.displays[i];
            if (display) {
                display.index = index++;
                if (!display.static) {
                    this.displayMap.push(i);
                }
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
        if (this._renderToScreen()) {
            this.renderDisplays();
        }
    }

    _renderToScreen() {
        if (this.beatKeeper.getSpeed('sixteen').starting()) {
            this.__renderToScreen = true;

        } else if (this.config.DisplaySettings.fps < 30) {
            this.__renderToScreen = true;

        } else {
            this.__renderToScreen = !this.__renderToScreen;
        }

        return this.__renderToScreen;
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

            if (color === '') {
                let canvas = display.getSource() ? display.getSource().current() : false;
                color = (canvas && canvas._color) ? canvas._color : this.renderer.currentLayer.shapeColor(false);
            }

            display.drawBorder(lw, color, mode, speed);

        }
    }

    /**
     *
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
    reset(resolution) {
        this.resize(resolution);
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
    renderDisplays() {
        let fallback = this.renderer.current();

        for (let i = 0; i < this.displays.length; i++) {
            let display = this.displays[i];

            if (display && !display.offline) {
                this.doDisplayVisibility(display, i);

                if (display.visible) {
                    display.render(fallback);

                } else {
                    display.clear();
                }

                let bm = this.config.DisplaySettings.border_mode;
                this.renderBorder(display, this.borderSpeed(), bm);

            }
        }
    }

    doDisplayVisibility(display, index) {
        let plugin = DisplayManager.plugins.display_visibility[this.config.DisplaySettings.display_visibility];

        if (plugin.before(display)) {
            plugin.apply(display);
        }
        // this._dirty = true;
    }

    /**
     *
     * @returns {Speed}
     */
    borderSpeed() {
        let borderSpeed = this.config.DisplaySettings.border_speed;
        let speed = this.beatKeeper.getDefaultSpeed();
        if (borderSpeed === 'peak') {
            if (this.audioAnalyser.peak) {
                speed.prc = 0;

            } else {
                speed.prc = 1;
            }
        } else {
            speed = this.beatKeeper.getSpeed(borderSpeed);
        }

        return speed;
    }


    /**
     *
     * @returns {Speed}
     */
    displaySpeed() {
        let displaySpeed = this.config.DisplaySettings.display_speed;
        let speed = this.beatKeeper.getDefaultSpeed();
        if (displaySpeed === 'peak') {
            if (this.audioAnalyser.peak) {
                speed.prc = 0;

            } else {
                speed.prc = 1;
            }
        } else {
            speed = this.beatKeeper.getSpeed(displaySpeed);
        }
        return speed;
    }

    initEvents() {
        EventManager.register(EVENT_FULL_RESET, 'displayman', (emitter) => {
            this.resize(emitter.getResolution());
        });
        EventManager.register(EVENT_RESIZE, 'displayman', (emitter) => {
            this.resize(emitter.getResolution());
        });
    }
}

export {DisplayManager}
