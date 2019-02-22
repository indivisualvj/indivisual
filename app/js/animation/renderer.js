/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {

    /**
     *
     * @param config
     * @constructor
     */
    HC.Renderer = function (config) {
        this.type = 'animation';
        this.layers = config.layers;
        this.flipx = 1;
        this.flipy = 1;
        this.resolution = {x: 1280, y: 720, aspect: 1280 / 720};
        this._renderer = false;
        this.three = {
            renderer: false,
            scene: false
        };
        this.currentLayer = false;
        this.nextLayer = false;
        this.lastLayer = false;
        this.layerSwitched = false;

        this.initThreeJs();
        this.initLayers(false);
    };

    HC.Renderer.prototype = {

        /**
         *
         * @param keepsettings
         */
        fullReset: function (keepsettings) {
            this.resize();
            this.initLayers(keepsettings);
            this.setLayer(0);
        },

        /**
         *
         */
        initThreeJs: function () {
            if (!this.three.renderer) {
                var conf = {alpha: true, antialias: ANTIALIAS};
                this.three.renderer = new THREE.WebGLRenderer(conf);
                this.three.renderer.shadowMap.enabled = true;
                this.three.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                this.three.renderer.view = this.three.renderer.domElement;
                this.three.renderer.view.id = 'threeWebGL';

                this.three.renderer.view.addEventListener('webglcontextlost', function () {
                    listener.fireAll('webglcontextlost');
                });

                this.three.scene = new THREE.Scene();
                this.three.perspective0 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
                this.three.perspective1 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
                this.three.perspective2 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);

                // listener.register('layer.doCameraMode', 'perspectives', function (cam) {

                // })
            }
        },

        initLayers: function (keepsettings) {

            for (var i = 0; i < this.layers.length; i++) {
                var op = false;
                var os = false;
                var ol = this.layers[i];

                if (ol) {
                    /**
                     * maybe keepsettings but never discard settings from layers excluded by ControlSettings.shuffleable
                     * those layers are there to record samples while animation is offline or to test certain settings/setups
                     */
                    if ((keepsettings || !layerShuffleable(i))) {
                        op = this.layers[i].preset;
                        os = this.layers[i].settings;
                    }
                    ol.dispose();
                }

                var l = new HC.Layer(this.resolution, i, this.three);

                l.preset = op;
                l.settings = os || statics.AnimationSettings.defaults();

                this.layers[i] = l;

                this.resetLayer(l);
            }

            this.currentLayer = this.layers[statics.ControlSettings.layer];

        },

        /**
         *
         * @param force
         */
        switchLayer: function (force) {
            this.layerSwitched = false;

            if (this.nextLayer) {

                if (this.currentLayer !== this.nextLayer) {

                    if (!force && statics.ControlSettings.shuffle) {
                        var speed = this.nextLayer.getCurrentSpeed();
                        if (speed.prc != 0) {
                            return;
                        } else {

                        }
                    }

                    this.currentLayer.pause();
                    this.nextLayer.resume();
                    this.setLayer(this.nextLayer.index);

                    this.currentLayer = this.nextLayer;
                    this.nextLayer = false;
                    this.layerSwitched = true;

                } else {
                    this.setLayer(this.nextLayer.index);
                    this.nextLayer = false;
                }
            }
        },

        /**
         *
         * @param index
         */
        setLayer: function (index) {

            for (var i in this.layers) {
                i = parseInt(i);
                var l = this.layers[i]._layer;

                if (i == index) {
                    this.three.scene.add(l);

                } else {
                    this.three.scene.remove(l);
                }
            }

        },

        /**
         *
         */
        pauseLayers: function () {
            for (var i = 0; i < this.layers.length; i++) {
                this.layers[i].pause();
            }
        },

        /**
         *
         */
        resumeLayers: function () {
            for (var i = 0; i < this.layers.length; i++) {
                this.layers[i].resume();
            }
        },

        /**
         *
         * @param layer
         * @param hook
         */
        animateLayer: function (layer, hook) {
            if (isNumber(layer) || isString(layer)) {
                layer = this.layers[layer];

            } else {
                layer = this.currentLayer;
            }

            layer.animate(hook);
        },

        /**
         *
         * @param layer
         */
        resetLayer: function (layer) {

            if (isNumber(layer) || isString(layer)) {
                layer = this.layers[layer];
            }

            this.nextLayer = false;

            layer.fullReset();
        },

        /**
         *
         */
        resize: function () {
            var res = this.getResolution();
            this.resolution = res;

            if (this.three.scene) {
                this.three.scene.position.x = -res.x / 2;
                this.three.scene.position.y = res.y / 2;
            }

            if (this.three.renderer) {
                this.three.renderer.setSize(res.x, res.y);
            }

            if (this.three.perspective0) {
                var aspect = res.aspect;
                this.three.perspective0.aspect = aspect;
                this.three.perspective1.aspect = aspect;
                this.three.perspective2.aspect = aspect;
            }

        },

        /**
         *
         * @returns {{aspect: number, x: number, y: number}}
         */
        getResolution: function () {
            var resolution;

            var res = statics.DisplaySettings.resolution;
            if (res) {
                var sp = res.split(/[\:x]/);
                if (sp.length > 1) {
                    var w = parseInt(sp[0]);
                    var h = parseInt(sp[1]);
                    resolution = {x: w, y: h, aspect: w / h};
                }
            }

            return resolution;
        },

        /**
         *
         * @returns {boolean|*}
         */
        current: function () {

            if (this._renderer && this._renderer.view) {
                this._renderer.view._color = this.currentLayer.shapeColor(false);
                return this._renderer.view;

            } else {
                return false;
            }
        },

        /**
         *
         * @returns {*}
         */
        brightness: function () {
            return displayman.brightness();
        },

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds: function (reference) {
            return reference;
        },

        /**
         *
         */
        render: function () {

            this._renderer = this.three.renderer;

            if (this.currentLayer.shaders()) {
                this.currentLayer.doShaders();
                this.currentLayer._composer.render();

            } else {
                this.three.renderer.render(this.three.scene, this.currentLayer.three.camera, this.three.target);
            }
        },

        /**
         *
         * @returns {*}
         */
        currentColor: function () {
            var hc = this.currentLayer.shapeColor(false);

            return hc;
        }
    }
})();