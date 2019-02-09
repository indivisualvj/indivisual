/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function() {

    /**
     *
     * @param width
     * @param height
     * @param index
     * @param three
     * @constructor
     */
    HC.Layer = function (width, height, index, three) {
        this.index = index;
        this.preset = false;
        this.settings = false;
        this.lights = false;
        this.ambientLight = false;
        this.shapes = false;
        this.shape = false;
        this.plugins = {};

        this.width = width;
        this.height = height;
        this.tween = new TWEEN.Group();
        this.lastUpdate = 0;
        this._rotation = false;
        this._shapes = false;
        this._lighting = false;
        this._layer = new THREE.Group();
        this._layer.name = '_layer' + index;

        this.three = {
            renderer: three.renderer,
            target: three.target,
            scene: three.scene,
            camera: new THREE.PerspectiveCamera(50, 1, 0.1, 500000)
        };
        this._composer = new THREE.EffectComposer(this.three.renderer, this.three.target);
        this._composer.addPass(new THREE.RenderPass(this.three.scene, this.three.camera));

        this.initBoundaries();
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
            this._rotation.position.set(this.halfDiameterVector.x, -this.halfDiameterVector.y, 0);

            this._shapes = new THREE.Group();
            this._shapes.name = '_shapes' + this.index;
            this._shapes.position.set(-this.halfDiameterVector.x, this.halfDiameterVector.y, 0);

            this._rotation.add(this._shapes);
            this._layer.add(this._rotation);
        },

        /**
         *
         */
        initBoundaries: function () {
            var width = this.width;
            var height = this.height;

            var aspect = this.width / this.height;
            this.three.camera.aspect = aspect;

            this.defaultResolutionVector = new THREE.Vector2(1280, 720);
            this.diameterVector = new THREE.Vector2(width, height);
            this.halfDiameterVector = new THREE.Vector2(width / 2, height / 2);
            this.relativeDiameterVector = new THREE.Vector2().copy(this.diameterVector).divide(this.defaultResolutionVector);
            this.staticCenterVector = new THREE.Vector3(0, 0, 0);
        },

        /**
         *
         * @param resolution
         */
        fullReset: function (resolution) {
            this.resetPlugins();
            this.resetSizes(resolution);
            this.resetShapes();
            this.resetLighting();
            this.updateShaders();
        },

        /**
         *
         * @param resolution
         */
        resetSizes: function (resolution) {

            if (resolution !== undefined) {
                this.width = resolution.width;
                this.height = resolution.height;
            }
            var width = this.width;
            var height = this.height;

            this.initBoundaries();

            if (this._composer) {
                this._composer.setSize(width, height);
            }
        },

        /**
         *
         */
        resetShapes: function () {

            this.initRotator();
            this.resetAnimation();
            this.getShapeGeometryPlugin().reset();
            this.getShapeModifierPlugin().reset();

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
                this.shape._position.traverse(threeDispose);
                this.shape = false;
            }

            this.resetAnimation();
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
            this.lastUpdate = HC.now();
        },

        /**
         *
         */
        resume: function () {
            this.lastUpdate = HC.now() - this.lastUpdate;
        }
    }
})();
