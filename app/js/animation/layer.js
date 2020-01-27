/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     * 
     * @type {HC.Layer}
     */
    HC.Layer = class Layer {

        /**
         * @type {HC.Animation}
         */
        animation;

        /**
         * @type {HC.Renderer}
         */
        renderer;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         * @type {number}
         */
        index;

        /**
         *
         * @type {boolean}
         */
        preset = false;
        settings = false;

        /**
         * @type {Object.<string, HC.ControlSet>}
         */
        controlSets;
        lights = false;
        ambientLight = false;
        shapes = false;
        shape = false;

        /**
         *
         * @type {Object.<string, HC.Plugin>}
         */
        plugins = {};

        /**
         *
         * @type {number}
         */
        lastUpdate = 0;

        /**
         *
         * @type {THREE.Group}
         * @private
         */
        _rotation;
        _shapes = false;
        _lighting = false;
        _background = false;

        /**
         * @type {Object.<string, *>}
         */
        three;

        /**
         * @type {THREE.EffectComposer}
         */
        _composer;

        /**
         * @type {TWEEN.Group}
         */
        tween;

        /**
         * @type {THREE.Scene}
         */
        _layer;

        /**
         *
         * @param {HC.Animation} animation
         * @param {HC.Renderer} renderer
         * @param index
         */
        constructor (animation, renderer, index) {
            this.animation = animation;
            this.beatKeeper = animation.beatKeeper;
            this.renderer = renderer;
            this.index = index;

            this.tween = new TWEEN.Group();
            this._layer = new THREE.Scene();
            this._layer.name = '_layer' + index;

            let three = renderer.three;

            this.three = {
                renderer: three.renderer,
                target: three.target,
                scene: three.scene,
                camera: new THREE.PerspectiveCamera(50, 1, 0.1, 500000)
            };
            this._composer = new THREE.EffectComposer(this.three.renderer, this.three.target);
            this._composer.addPass(new THREE.RenderPass(this.three.scene, this.three.camera));

            this.resetSizes(renderer.resolution);
        }

        /**
         *
         */
        initRotator() {
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
        }

        /**
         *
         * @param resolution
         */
        initBoundaries(resolution) {

            let width = resolution.x;
            let height = resolution.y;

            this._resolution = {
                full: new THREE.Vector2(width, height),
                half: new THREE.Vector2(width / 2, height / 2),
                relative: new THREE.Vector2(width, height).divide(new THREE.Vector2(1280, 720)),
                'default': new THREE.Vector2(1280, 720)
            };

            this._resolution.full.aspect = resolution.aspect;
            this.three.camera.aspect = resolution.aspect;
        }

        /**
         *
         * @param variant
         * @returns {Vector2|*}
         */
        resolution(variant) {

            if (variant && variant in this._resolution) {
                return this._resolution[variant];
            }

            return this._resolution.full;
        }

        /**
         *
         */
        fullReset() {
            this.reloadPlugins();
            this.resetShapes();
            this.resetLighting();
            this.resetBackground();
            this.updateShaders();
            this.updateShaderPasses();
        }

        /**
         *
         * @param resolution
         */
        resetSizes(resolution) {

            this.initBoundaries(resolution);

            if (this._composer) {
                this._composer.setSize(this.resolution().x, this.resolution().y);
            }
        }

        /**
         *
         */
        resetShapes() {

            this.resetPlugins();
            this.initRotator();
            this.resetAnimation();

            let sgp = this.getShapeGeometryPlugin();
            if (sgp)sgp.reset();
            let smp = this.getShapeModifierPlugin();
            if (smp)smp.reset();

            this.shapes = [];
            this.shapeCache = [];

            this.shape = this.nextShape(-1, true);

            for (let i = 0; i < this.settings.pattern_shapes; i++) {

                let shape = this.nextShape(i);

                this.shapes.push(shape);
                this.shapeCache.push([]);

                this.addShape(shape);
            }
        }

        /**
         *
         */
        dispose() {

            let sc = this.three.scene;
            this.settings = false;
            this.controlSets = false;
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
        }

        /**
         *
         * @returns {boolean}
         */
        isVisible() {
            return !!this._layer.parent;
        }

        /**
         *
         */
        resetAnimation() {
            if (this.tween) {
                this.tween.removeAll();
            }
            this.lastUpdate = 0;
            // this.tween = new TWEEN.Group();
        }

        /**
         *
         * @returns {*}
         */
        updateShaders() {
            let shaders = null;
            let li = 0;

            for (let key in this.settings.shaders) {
                let sh = this.settings.shaders[key];

                if (sh && sh.apply) {

                    let plugin = this.getShaderPlugin(key);
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
                for (let i = 0; i < shaders.length; i++) {
                    if (!shaders[i]) {
                        shaders.splice(i, 1);
                        i--;
                    }
                }
            }

            this.shaders(shaders);

            return shaders;
        }

        /**
         *
         * @returns {*}
         */
        updateShaderPasses() {
            let shaders = null;
            if (cm) {
                let passes = cm.get(this.index, 'passes');
                let shds = passes.getShaderPasses();

                for (let index in shds) {

                    let shader = passes.getShader(index);

                    if (shader && shader.apply) {
                        let name = passes.getShaderName(index);
                        let key = passes.getShaderPassKey(index);
                        let plugin = this.getShaderPassPlugin(name, key, shader);
                        if (plugin) {
                            plugin.create();
                            plugin.updateResolution();

                            if (!shaders) {
                                shaders = [];
                            }

                            shaders.push(plugin);
                        }
                    }
                }
            }
            this.shaders(shaders);

            return shaders;
        }

        /**
         *
         */
        pause() {
            this.lastUpdate = this.animation.now;
        }

        /**
         *
         */
        resume() {
            this.lastUpdate = this.animation.now - this.lastUpdate;
        }
    }
}
