/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Renderer}
     */
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
         *
         * @type {boolean}
         */
        layerSwitched = false;

        /**
         *
         * @param config
         */
        constructor(config) {
            this.layers = config.layers;

            this.initThreeJs();
            this.initLayers(false);
        }

        /**
         *
         * @param keepSettings
         */
        fullReset(keepSettings) {
            listener.removeEvent('renderer.render');
            this.resize();
            this.initLayers(keepSettings);
            this.setLayer(0);
        }

        /**
         *
         */
        initThreeJs() {
            if (!this.three.renderer) {
                let conf = {alpha: true, antialias: ANTIALIAS};
                this.three.renderer = new THREE.WebGLRenderer(conf);
                this.three.renderer.shadowMap.enabled = true;
                this.three.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                this.three.renderer.view = this.three.renderer.domElement;
                this.three.renderer.view.id = 'threeWebGL';

                this.three.renderer.view.addEventListener('webglcontextlost', function () {
                    listener.fireEvent('webglcontextlost');
                });

                this.three.scene = new THREE.Scene();
                this.three.perspective0 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
                this.three.perspective1 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
                this.three.perspective2 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);

                // listener.register('layer.doCameraMode', 'perspectives', function (cam) {

                // })
            }
        }

        initLayers(keepsettings) {

            if (this._layers) {
                this.three.scene.remove(this._layers);
                this._layers.traverse(threeDispose);
            }
            this._layers = new THREE.Group();
            this.three.scene.add(this._layers);

            for (let i = 0; i < this.layers.length; i++) {
                let op = false;
                let os = false;
                let ol = this.layers[i];

                if (ol) {
                    /**
                     * maybe keepsettings but never discard settings from layers excluded by ControlSettings.shuffleable
                     * those layers are there to record samples while animation is offline or to test certain settings/setups
                     */
                    if ((keepsettings || !layerShuffleable(i))) {
                        op = this.layers[i].preset;
                        os = this.layers[i].controlSets;
                    }
                    ol.dispose();
                }

                let l = new HC.Layer(this, i);

                l.preset = op;
                l.controlSets = os || HC.LayeredControlSetsManager.initAll(statics.AnimationValues);
                l.settings = HC.LayeredControlSetsManager.settingsProxy(os || l.controlSets);

                this.layers[i] = l;

                this.resetLayer(l);
            }

            this.currentLayer = this.layers[statics.ControlSettings.layer];

        }

        /**
         *
         * @param force
         */
        switchLayer(force) {
            this.layerSwitched = false;

            if (this.nextLayer) {

                if (this.currentLayer !== this.nextLayer) {
                    if (!force && statics.ControlSettings.shuffle_mode != 'off') {
                        let speed = this.nextLayer.getCurrentSpeed();
                        if (!speed.starting()) {
                            return;
                        } else {

                        }
                    }

                    if (!this.currentLayer.settings.layer_transvisible) {
                        this.currentLayer.pause();
                    }
                    if (!this.nextLayer.settings.layer_transvisible) {
                        this.nextLayer.resume();
                    }
                    this.setLayer(this.nextLayer.index);

                    this.currentLayer = this.nextLayer;
                    this.nextLayer = false;
                    this.layerSwitched = true;

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

                if (i == index || transvisible) {
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
         * Render current and all transvisible layers
         * @param hook
         */
        animate(hook) {
            for (let l in this.layers) {
                let layer = this.layers[l];
                if (layer == this.currentLayer || layer.settings.layer_transvisible) {
                    layer.animate(hook);
                    hook = undefined;
                }
            }
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

            layer.fullReset();
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

            let res = statics.DisplaySettings.resolution;
            if (res) {
                let sp = res.split(/[\:x]/);
                if (sp.length > 1) {
                    let w = parseInt(sp[0]);
                    let h = parseInt(sp[1]);
                    resolution = {x: w, y: h, aspect: w / h};
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
            return displayman.brightness();
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

            if (this._last != animation.now) {
                listener.fireEvent('renderer.render', this);

                this.three.scene.background = this.currentLayer._layer.background;
                this.three.scene.fog = this.currentLayer._layer.fog;

                if (this.currentLayer.shaders()) {
                    this.currentLayer.doShaders();
                    this.currentLayer._composer.render();

                } else {
                    this.three.renderer.render(this.three.scene, this.currentLayer.three.camera, this.three.target);
                }

                this._last = animation.now;
            }
        }

        /**
         *
         * @returns {*}
         */
        currentColor() {
            let hc = this.currentLayer.shapeColor(false);

            return hc;
        }
    }
}
