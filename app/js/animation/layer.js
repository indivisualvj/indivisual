/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {

    /**
     *
     * @param renderer
     * @param index
     * @constructor
     */
    HC.Layer = function (renderer, index) {
        this.renderer = renderer;
        this.index = index;
        this.preset = false;
        this.settings = false;
        this.lights = false;
        this.ambientLight = false;
        this.shapes = false;
        this.shape = false;
        this.plugins = {};

        this.tween = new TWEEN.Group();
        this.lastUpdate = 0;
        this._rotation = false;
        this._shapes = false;
        this._lighting = false;
        this._background = false;
        this._layer = new THREE.Scene();
        this._layer.name = '_layer' + index;

        var three = renderer.three;

        this.three = {
            renderer: three.renderer,
            target: three.target,
            scene: three.scene,
            camera: new THREE.PerspectiveCamera(50, 1, 0.1, 500000)
        };
        this._composer = new THREE.EffectComposer(this.three.renderer, this.three.target);
        this._composer.addPass(new THREE.RenderPass(this.three.scene, this.three.camera));

        this.resetSizes(renderer.resolution);
    };

    HC.Layer.prototype = {

        /**
         *
         */
        initRotator: function () {

            if (this._rotation) {
                this._layer.remove(this._rotation);
                this._rotation.traverse(threeDispose);
            }

            this._rotation = new THREE.Group();
            this._rotation.name = '_rotation' + this.index;
            this.position(0, 0, 0);

            this._shapes = new THREE.Group();
            this._shapes.name = '_shapes' + this.index;
            this._shapes.position.set(-this.resolution('half').x, this.resolution('half').y, 0);

            this._rotation.add(this._shapes);
            this._layer.add(this._rotation);
        },

        /**
         *
         * @param resolution
         */
        initBoundaries: function (resolution) {

            var width = resolution.x;
            var height = resolution.y;

            this._resolution = {
                full: new THREE.Vector2(width, height),
                half: new THREE.Vector2(width / 2, height / 2),
                relative: new THREE.Vector2(width, height).divide(new THREE.Vector2(1280, 720)),
                'default': new THREE.Vector2(1280, 720)
            };

            this._resolution.full.aspect = resolution.aspect;
            this.three.camera.aspect = resolution.aspect;
        },

        /**
         *
         * @param variant
         * @returns {*}
         */
        resolution: function (variant) {

            if (variant && variant in this._resolution) {
                return this._resolution[variant];
            }

            return this._resolution.full;
        },

        /**
         *
         */
        fullReset: function () {
            this.reloadPlugins();
            this.resetShapes();
            this.resetLighting();
            this.resetBackground();
            this.updateShaders();
        },

        /**
         *
         * @param resolution
         */
        resetSizes: function (resolution) {

            this.initBoundaries(resolution);

            if (this._composer) {
                this._composer.setSize(this.resolution().x, this.resolution().y);
            }
        },

        /**
         *
         */
        resetShapes: function () {

            this.resetPlugins();
            this.initRotator();
            this.resetAnimation();
            var sgp = this.getShapeGeometryPlugin();
            if (sgp)sgp.reset();
            var smp = this.getShapeModifierPlugin();
            if (smp)smp.reset();

            this.shapes = [];
            this.shapeCache = [];

            this.shape = this.nextShape(-1, true);

            for (var i = 0; i < this.settings.pattern_shapes; i++) {

                var shape = this.nextShape(i);

                this.shapes.push(shape);
                this.shapeCache.push([]);

                this.addShape(shape);
            }
        },

        /**
         *
         */
        dispose: function () {

            var sc = this.three.scene;
            this.settings = false;
            this.shapes = false;
            this.plugins = {};
            this._shapes = false;

            sc.remove(this._layer);
            this._layer.traverse(threeDispose);
            this._lighting = false;
            this._rotation = false;
            this._shapes = false;

            if (sc.background && sc.background.dispose) {
                sc.background.dispose();
            }

            if (this.shape) {
                this.shape.sceneObject().traverse(threeDispose);
                this.shape = false;
            }

            this.resetAnimation();
        },

        /**
         *
         * @returns {boolean}
         */
        isVisible: function () {
            return !!this._layer.parent;
        },

        /**
         *
         */
        resetAnimation: function () {
            if (this.tween) {
                this.tween.removeAll();
            }
            this.lastUpdate = 0;
            // this.tween = new TWEEN.Group();
        },

        /**
         *
         * @returns {*}
         */
        updateShaders: function () {
            var shaders = null;
            var li = 0;

            for (var key in this.settings.shaders) {
                var sh = this.settings.shaders[key];

                if (sh && sh.apply) {

                    var plugin = this.getShaderPlugin(key);
                    if (plugin) {
                        plugin.create();
                        plugin.updateResolution();
                        if (!shaders) {
                            shaders = [];
                        }

                        while (shaders.length < sh.index) {
                            shaders.push(false);
                        }
                        if (li == 0 && sh.index == 0) { // append
                            shaders.push(plugin);

                        } else { // insert
                            shaders.splice(sh.index, 0, plugin);
                        }

                        li = sh.index;
                    }
                }
            }

            if (shaders) {
                for (var i = 0; i < shaders.length; i++) {
                    if (!shaders[i]) {
                        shaders.splice(i, 1);
                        i--;
                    }
                }
            }

            this.shaders(shaders);

            return shaders;
        },

        /**
         *
         */
        pause: function () {
            this.lastUpdate = animation.now;
        },

        /**
         *
         */
        resume: function () {
            this.lastUpdate = animation.now - this.lastUpdate;
        }
    }
})();
