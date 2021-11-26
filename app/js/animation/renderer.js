/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.Renderer = class Renderer {

        /**
         *
         * @type {string}
         */
        type = 'animation';

        /**
         * @type {Array}
         */
        layers;

        /**
         *
         * @type {number}
         */
        flipx = 1;

        /**
         *
         * @type {number}
         */
        flipy = 1;

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
         *
         * @param {HC.Animation} animation
         * @param config
         */
        constructor(animation, config) {
            this.animation = animation;
            this.config = animation.config;
            this.beatKeeper = animation.beatKeeper;
            this.layers = config.layers;

            this.initThreeJs();
        }

        /**
         *
         * @param keepSettings
         */
        fullReset(keepSettings) {
            HC.EventManager.removeEvent(EVENT_RENDERER_BEFORE_RENDER);
            this.resize();
            this.initLayers(keepSettings);
            this.setLayer(0);
        }

        /**
         *
         */
        initThreeJs() {
            if (!this.three.renderer) {
                let canvas = new OffscreenCanvas(1, 1);

                let conf = {alpha: true, antialias: ANTIALIAS, canvas: canvas};
                this.three.renderer = new THREE.WebGLRenderer(conf);
                this.three.renderer.shadowMap.enabled = true;
                this.three.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

                canvas.id = 'threeWebGL';
                canvas.style = {width: 1, height: 1};
                canvas.addEventListener(EVENT_WEBGL_CONTEXT_LOST, () => {
                    HC.EventManager.fireEvent(EVENT_WEBGL_CONTEXT_LOST); // todo use const
                });

                this.three.renderer.view = canvas;

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
                 * @type {HC.Layer}
                 */
                let ol = this.layers[i];

                if (ol) {
                    if (keepsettings) {
                        oldControlSets = this.layers[i].controlSets;
                    }
                    ol._dispose();
                }

                let layer = new HC.Layer(this.animation, this, i);

                layer.controlSets = oldControlSets || HC.LayeredControlSetsManager.initAll(this.config.AnimationValues);
                layer.settings = HC.LayeredControlSetsManager.settingsProxy(oldControlSets || layer.controlSets);

                this.layers[i] = layer;

                HC.EventManager.fireEventId(EVENT_LAYER_RESET, layer.index, layer, 0);
            }

            this.currentLayer = this.layers[this.config.ControlSettings.layer];

        }

        /**
         *
         * @param force
         */
        switchLayer(force) {

            if (this.nextLayer) {
                if (this.currentLayer !== this.nextLayer) {
                    if (!force && this.config.ControlSettings.shuffle_mode !== 'off') {
                        let speed = this.nextLayer.getCurrentSpeed();
                        if (!speed.starting()) {
                            if (!this._isForceAnimate(this.nextLayer)) {
                                console.log('HC.Renderer.switchLayer', 'fail', 'speed in progress')
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
                    this.setLayer(this.nextLayer.index);

                    this.currentLayer = this.nextLayer;
                    this.nextLayer = false;

                } else {
                    this.setLayer(this.nextLayer.index);
                    this.nextLayer = false;
                }
            }
        }

        /**
         *
         * @param index
         */
        setLayer(index) {

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
         */
        pauseLayers() {
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].pause();
            }
        }

        /**
         *
         */
        resumeLayers() {
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].resume();
            }
        }

        /**
         *
         */
        animate() {
            for (let l in this.layers) {
                let layer = this.layers[l];
                if (layer === this.currentLayer || this._isForceAnimate(layer)) {
                    layer.animate();
                }
            }
        }

        _isForceAnimate(layer) {
            let shuffleable = !this.animation.settingsManager.isDefault(layer.index) && this.config.shuffleable(layer.index+1);
            let fastShuffling = this.config.ControlSettings.shuffle_mode !== 'off' && this.config.ControlSettings.shuffle_every < 4;
            let shuffling = (shuffleable && fastShuffling);

            if (layer.settings.layer_transvisible || shuffling) {
                return true;
            }

            return false
        }

        /**
         *
         * @param layer
         */
        resetLayer(layer) {

            if (isNumber(layer) || isString(layer)) {
                layer = this.layers[layer];
            }

            this.nextLayer = false;
            layer.needsReset = true;
        }

        /**
         *
         */
        resize() {
            let res = this.getResolution();
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
         * @returns {{aspect: number, x: number, y: number}}
         */
        getResolution() {
            let resolution;

            let res = this.config.DisplaySettings.resolution;
            if (res) {
                let sp = res.split(/[\:x]/);
                if (sp.length > 1) {
                    let w = parseInt(sp[0]);
                    let h = parseInt(sp[1]);
                    resolution = {x: w, y: h, aspect: w / h, diameter: new THREE.Vector2(w, h).length()};
                }
            }

            return resolution;
        }

        /**
         *
         * @returns {boolean|*}
         */
        current() {
            this.render();

            let renderer = this.three.renderer;
            if (renderer && renderer.view) {
                renderer.view._color = this.currentLayer.shapeColor(false);
                return renderer.view;

            } else {
                return false;
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
         * @param reference
         * @returns {*}
         */
        bounds(reference) {
            return reference;
        }

        /**
         *
         */
        render() {
            if (this._last !== this.animation.now) {

                this.three.scene.background = this.currentLayer._layer.background;
                this.three.scene.fog = this.currentLayer._layer.fog;

                HC.EventManager.fireEvent(EVENT_RENDERER_BEFORE_RENDER, this);

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
         * @returns {string}
         */
        currentColor() {
            return this.currentLayer.shapeColor(false);
        }
    }
}
