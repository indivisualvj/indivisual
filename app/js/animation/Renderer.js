/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {EventManager} from "../manager/EventManager";
import {LayeredControlSetManager} from "../manager/LayeredControlSetManager";
import {Layer} from "./layer/ShapeLayer";

class Renderer {

    static plugins;

    /**
     * @type {Array}
     */
    layers;

    /**
     *
     * @type {{aspect: number, x: number, y: number}}
     */
    resolution = {x: 1280, y: 720, aspect: 1280 / 720};

    /**
     *
     * @type {{renderer: THREE.WebGLRenderer, perspective2: THREE.PerspectiveCamera, perspective0: THREE.PerspectiveCamera, perspective1: THREE.PerspectiveCamera, scene: THREE.Scene}}
     */
    three = {
        renderer: null,
        scene: null,
        target: undefined,
        perspective0: null,
        perspective1: null,
        perspective2: null
    };

    /**
     * @type {Object}
     */
    currentLayer;

    /**
     * @type {Object}
     */
    nextLayer;

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
     * @type {{}}
     */
    plugins;


    /**
     *
     * @param {Animation} animation
     * @param config
     */
    constructor(animation, config) {
        this.animation = animation;
        this.config = animation.config;
        this.beatKeeper = animation.beatKeeper;
        this.layers = config.layers;

        this._initThreeJs();
        this.initEvents();
    }

    /**
     *
     * @param keepSettings
     */
    fullReset(keepSettings) {
        EventManager.removeEvent(EVENT_RENDERER_BEFORE_RENDER);
        this.resize();
        this.initLayers(keepSettings);
        this._setLayer(0);
    }

    /**
     *
     * @private
     */
    _initThreeJs() {
        if (!this.three.renderer) {
            let canvas = new OffscreenCanvas(1, 1);

            let conf = {alpha: true, antialias: ANTIALIAS, canvas: canvas};
            this.three.renderer = new THREE.WebGLRenderer(conf);
            this.three.renderer.shadowMap.enabled = true;
            this.three.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.three.renderer.view = canvas;

            canvas.id = 'threeWebGL';
            canvas.style = {width: 1, height: 1};
            canvas.addEventListener(EVENT_WEBGL_CONTEXT_LOST, () => {
                EventManager.fireEvent(EVENT_WEBGL_CONTEXT_LOST);
            });

            this.three.scene = new THREE.Scene();
            this.three.perspective0 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
            this.three.perspective1 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
            this.three.perspective2 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);


            // Observe a scene or a renderer
            if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
                __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: this.three.scene }));
                __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: this.three.scene }));
            }

        }
    }

    /**
     *
     * @param keepsettings
     */
    initLayers(keepsettings) {

        if (this._layers) {
            this.three.scene.remove(this._layers);
            this._layers.traverse(HC.dispose);
        }
        this._layers = new THREE.Group();
        this.three.scene.add(this._layers);

        for (let i = 0; i < this.layers.length; i++) {
            let oldControlSets = false;
            /**
             * @type {Layer}
             */
            let ol = this.layers[i];

            if (ol) {
                if (keepsettings) {
                    oldControlSets = this.layers[i].controlSets;
                }
                ol._dispose();
            }

            let nuControlSets = oldControlSets || LayeredControlSetManager.initAll(this.config.AnimationValues);
            let settings = LayeredControlSetManager.settingsProxy(nuControlSets);
            let layer = new Layer(this.animation, i, nuControlSets, settings);
            layer.controlSets = nuControlSets;
            this.animation.settingsManager.setLayerProperties(i, nuControlSets);

            this.layers[i] = layer;

            EventManager.fireEventId(EVENT_LAYER_RESET, layer.index, layer, 0);
        }

        this.currentLayer = this.layers[this.config.ControlSettings.layer];

    }

    /**
     *
     * @param force
     * @private
     */
    _switchLayer(force) {

        if (this.nextLayer) {
            if (this.currentLayer !== this.nextLayer) {
                if (!force && this.config.ControlSettings.shuffle_mode !== 'off') {
                    let speed = this.nextLayer.currentSpeed();
                    if (!speed.starting()) {
                        if (!this._isForceAnimate(this.nextLayer)) {
                            console.log('Renderer.switchLayer', 'fail', 'speed in progress')
                            return;
                        }
                    } else {

                    }
                }

                if (!this._isForceAnimate(this.currentLayer)) {
                    this.currentLayer.pause();
                }
                if (!this._isForceAnimate(this.nextLayer)) {
                    this.nextLayer.resume();
                }
                this._setLayer(this.nextLayer.index);

                this.currentLayer = this.nextLayer;
                this.nextLayer = false;

            } else {
                this._setLayer(this.nextLayer.index);
                this.nextLayer = false;
            }
        }
    }

    /**
     *
     * @param index
     * @private
     */
    _setLayer(index) {
// todo: set layer event to set all necessary layers after loadpresets or reset etc. pp.
        for (let i in this.layers) {
            i = parseInt(i);
            let layer = this.layers[i];
            let transvisible = layer.settings.layer_transvisible;

            layer.setBackgroundVisible(i === index);

            if (i === index || transvisible) {
                this._layers.add(layer._layer);

            } else {
                this._layers.remove(layer._layer);
            }
        }
    }

    /**
     *
     * @private
     */
    _pauseLayers() {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].pause();
        }
    }

    /**
     *
     * @private
     */
    _resumeLayers() {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].resume();
        }
    }

    /**
     *
     * @private
     */
    _animate() {
        if (IS_ANIMATION) {
            this._doShuffle();
        }
        this._switchLayer(IS_PREVIEW);

        for (let l in this.layers) {
            let layer = this.layers[l];
            if (layer === this.currentLayer || this._isForceAnimate(layer)) {
                layer.animate();
            }
        }
    }

    /**
     *
     * @returns {number[]}
     */
    renderedLayers() {
        let rendered = [];
        for (let l = 0; l < this.layers.length; l++) {
            let layer = this.layers[l];
            if (layer === this.currentLayer || this._isForceAnimate(layer)) {
                rendered.push(l);
            }
        }

        return rendered;
    }

    _isForceAnimate(layer) {
        let shuffleable = !this.animation.settingsManager.isDefault(layer.index) && this.config.shuffleable(layer.index + 1);
        let fastShuffling = this.config.ControlSettings.shuffle_mode !== 'off' && this.config.ControlSettings.shuffle_every < 4;
        let shuffling = (shuffleable && fastShuffling);

        return (layer.settings.layer_transvisible || shuffling);
    }

    /**
     *
     */
    resize() {
        let res = this.animation.getResolution();
        this.resolution = res;

        if (this.three.scene) {
            this.three.scene.position.x = -res.x / 2;
            this.three.scene.position.y = res.y / 2;
        }

        if (this.three.renderer) {
            this.three.renderer.setSize(res.x, res.y);
        }

        if (this.three.target) {
            this.three.target.setSize(res.x, res.y);
        }

        if (this.three.perspective0) {
            let aspect = res.aspect;
            this.three.perspective0.aspect = aspect;
            this.three.perspective1.aspect = aspect;
            this.three.perspective2.aspect = aspect;
        }
    }

    /**
     *
     * @returns {null|OffscreenCanvas}
     */
    current() {
        this._render();

        let renderer = this.three.renderer;
        if (renderer && renderer.view) {
            renderer.view._color = this.currentLayer.shapeColor(false);
            return renderer.view;

        } else {
            return null;
        }
    }

    /**
     *
     * @returns {*}
     */
    brightness() {
        return this.animation.displayManager.brightness();
    }

    /**
     *
     */
    _render() {
        if (this._last !== this.animation.now) {

            this.three.scene.background = this.currentLayer._layer.background;
            this.three.scene.fog = this.currentLayer._layer.fog;

            EventManager.fireEvent(EVENT_RENDERER_BEFORE_RENDER, this);

            if (this.currentLayer.shaders()) {
                this.currentLayer.doShaders();
                this.currentLayer.three.composer.render();

            } else {
                this.three.renderer.render(this.three.scene, this.currentLayer.three.camera, this.three.target);
            }

            this._last = this.animation.now;
        }
    }


    /**
     *
     * @private
     */
    _doShuffle() {
        let plugin = this._getShuffleModePlugin();
        let result = plugin.apply();
        if (result !== false) {
            result = plugin.after();
            if (result !== false) {
                this.nextLayer = this.layers[result];
            }
        }
    }

    /**
     *
     * @param name
     * @returns {*}
     * @private
     */
    _getShuffleModePlugin(name) {
        if (!this.plugins) {
            this.plugins = {};
        }
        name = name || this.config.ControlSettings.shuffle_mode;

        if (!this.plugins[name]) {
            this.plugins[name] = new Renderer.plugins.shuffle_mode[name](this, this.config.ControlSettings);
        }

        return this.plugins[name];
    }


    /**
     *
     * @returns {string}
     */
    currentColor() {
        return this.currentLayer.shapeColor(false);
    }

    initEvents() {
        EventManager.register(EVENT_ANIMATION_ANIMATE, 'renderer', () => {
            this._animate();
        });
        EventManager.register(EVENT_ANIMATION_PLAY, 'renderer', () => {
            this._resumeLayers();
        });
        EventManager.register(EVENT_ANIMATION_PAUSE, 'renderer', () => {
            this._pauseLayers();
        });
        EventManager.register(EVENT_FULL_RESET, 'renderer', (emitter) => {
            this.fullReset(false);
        });
        EventManager.register(EVENT_RESIZE, 'renderer', (emitter) => {
            this.fullReset(true);
        });
        EventManager.register(EVENT_RESET, 'renderer', (emitter) => {
            this.fullReset(true);
        });
    }
}

export {Renderer}