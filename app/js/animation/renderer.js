/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function() {

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
        this.resolution = {x: 1280, y: 720, aspect: 1280/720};
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

                this.three.renderer.view.addEventListener( 'webglcontextlost', function () {
                    listener.fireAll('webglcontextlost');
                });

                this.three.scene = new THREE.Scene();
                // this.three.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
                this.three.perspective0 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
                this.three.perspective1 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
                this.three.perspective2 = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);

                // this.three.scene.add(this.three.camera);
                // this.three.scene.add(this.three.perspective0);
                // this.three.scene.add(this.three.perspective1);
                // this.three.scene.add(this.three.perspective2);

                // this.three.target = new THREE.WebGLRenderTarget();
                //
                // var shader = THREE.MappingShader;
                // this.three.material = new THREE.ShaderMaterial( {
                //
                //     defines: Object.assign( {}, shader.defines ),
                //     uniforms: shader.uniforms,
                //     vertexShader: shader.vertexShader,
                //     fragmentShader: shader.fragmentShader
                //
                // } );
                //
                // this.three.material.uniforms.tDiffuse.value = this.three.target.texture;
                //
                // this.three.scene = new THREE.Scene();
                //
                // this.three.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.width, this.height), this.three.material);
                // this.three.quad.frustumCulled = false;
                // this.three.scene.add(this.three.quad);

            }
            // if (this.three.quad) {
            //     this.three.scene.remove(this.three.quad);
            //     this.three.quad.geometry.dispose();
            // }
            // this.three.quad = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height), this.three.material);
            // this.three.quad.frustumCulled = false;
            // this.three.scene.add(this.three.quad);
            // this.three.camera = new THREE.OrthographicCamera(this.width/-2, this.width/2, this.height/2, this.height/-2, 0, 1);

            // this.three.target.setSize(this.width, this.height);

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

            // this.three.camera.layers.set(index);
            // this.three.perspective0.layers.set(index);
            // this.three.perspective1.layers.set(index);
            // this.three.perspective2.layers.set(index);
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
        getResolution: function () { // todo refactor name to ?
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

            // var v = this.three.quad.geometry.vertices;
            // var sourcePoints = [];
            // var targetPoints = [];
            //
            // for(var i in v) {
            //     sourcePoints.push([v[i].x, v[i].y]);
            //     targetPoints.push([v[i].x, v[i].y]);
            // }
            //
            // var p = displayman.getDisplay(0).loadMapping();
            // if (p) {
            //     targetPoints = p.targetPoints;
            // }
            //
            // for(var i in targetPoints) {
            //     targetPoints[i][0] /= 10;
            //     targetPoints[i][1] /= 10;
            // }
            //
            // targetPoints[0][0] /= -2;
            // targetPoints[0][1] /= 2;
            // targetPoints[1][0] /= 2;
            // targetPoints[1][1] /= 2;
            // targetPoints[2][0] /= -2;
            // targetPoints[2][1] /= -2;
            // targetPoints[3][0] /= 2;
            // targetPoints[3][1] /= -2;
            //
            //
            // for (var a = [], b = [], i = 0, n = sourcePoints.length; i < n; ++i) {
            //     var s = sourcePoints[i],
            //         t = targetPoints[i];
            //
            //     t = [t[0], t[1]];
            //     a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]), b.push(t[0]);
            //     a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]), b.push(t[1]);
            // }
            //
            // var X = numeric.solve(a, b, true);
            // var matrix = [
            //     X[0], X[3], 0, X[6],
            //     X[1], X[4], 0, X[7],
            //     0,    0,    1, 0,
            //     X[2], X[5], 0, 1
            // ];
            // matrix[12]=-145;
            // matrix[13]=135;
            // var m = new THREE.Matrix4().fromArray(matrix);
            // this.three.material.uniforms.transform.value = m;


            // this.three.renderer.render(this.three.scene, this.three.camera);
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