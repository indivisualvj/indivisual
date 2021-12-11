/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {TimeoutManager} from "../../manager/TimeoutManager";
import {EventManager} from "../../manager/EventManager";
import {Group, PerspectiveCamera, Vector2, Scene} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import * as HC from "../../shared/Three";

class _Layer
{

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
     * @type {number}
     */
    index;

    /**
     *
     * @type {boolean}
     */
    preset = false;

    /**
     *
     */
    settings;

    /**
     * @type {Object.<string, ControlSet>}
     */
    controlSets;

    /**
     * @type {Array.<Light>}
     */
    lights = [];

    /**
     * @type {AmbientLight|null}
     */
    ambientLight;

    /**
     * @type {[]}
     */
    shapes;

    /**
     * @type {[]}
     */
    shapeCache;

    /**
     * @type {Shape}
     */
    shape;

    materialColor;

    /**
     *
     * @type {boolean}
     */
    needsReset = false;

    /**
     *
     * @type {boolean}
     */
    shapesNeedReset = false;

    /**
     *
     * @type {boolean}
     */
    lightingNeedsReset = false;

    /**
     *
     * @type {boolean}
     */
    ambientNeedsReset = false;

    /**
     *
     * @type {boolean}
     */
    fogNeedsReset = false;

    /**
     *
     * @type {boolean}
     */
    shadersNeedUpdate = false;

    /**
     *
     * @type {boolean}
     */
    shapeMaterialsNeedUpdate = false;

    /**
     *
     * @type {Object.<string, Plugin>}
     */
    plugins = {};

    /**
     *
     * @type {number}
     */
    lastUpdate = 0;

    /**
     *
     * @type {Group}
     * @protected
     */
    _rotation;

    /**
     *
     * @type {Group}
     * @protected
     */
    _shapes;

    /**
     *
     * @type {Group}
     * @protected
     */
    _lighting;

    /**
     *
     * @type {Group}
     * @protected
     */
    _background;

    /**
     * @type {Texture}
     * @protected
     */
    _hiddenBackgroundTexture;

    /**
     * @type {Object.<string, *>}
     */
    three;

    /**
     * @type {TWEEN.Group|_Group}
     */
    tween;

    /**
     * @type {Scene}
     */
    _layer;

    /**
     *
     * @param {Animation} animation
     * @param index
     * @param controlSets
     * @param settings
     */
    constructor (animation, index, controlSets, settings) {
        this.animation = animation;
        this.config = animation.config;
        this.beatKeeper = animation.beatKeeper;
        this.index = index;
        this.controlSets = controlSets;
        this.settings = settings;

        this.tween = new TWEEN.Group();
        this._layer = new Scene();
        this._layer.name = '_layer' + index;

        let three = animation.renderer.three;
        let camera = new PerspectiveCamera(50, 1, 0.1, 500000);
        let composer = new EffectComposer(three.renderer, three.target);
        composer.readBuffer.stencilBuffer = true;
        composer.writeBuffer.stencilBuffer = true;
        let renderPass = new RenderPass(three.scene, camera, null);
        composer.addPass(renderPass);

        this.three = {
            renderer: three.renderer,
            target: three.target,
            scene: three.scene,
            camera: camera,
            renderPass: renderPass,
            composer: composer,
        };

        this._resetSizes(animation.renderer.resolution);
        this.needsReset = true;
    }

    /**
     *
     * @protected
     */
    _initRotator() {
        if (this._rotation) {
            this._layer.remove(this._rotation);
            this._rotation.traverse(HC.dispose);
        }

        this._rotation = new Group();
        this._rotation.name = '_rotation' + this.index;
        this.position(0, 0, 0);

        this._shapes = new Group();
        this._shapes.name = '_shapes' + this.index;
        this._shapes.position.set(-this.resolution('half').x, this.resolution('half').y, 0);

        this._rotation.add(this._shapes);
        this._layer.add(this._rotation);
    }

    /**
     *
     * @param resolution
     * @protected
     */
    _initBoundaries(resolution) {

        let width = resolution.x;
        let height = resolution.y;

        this._resolution = {
            full: new Vector2(width, height),
            half: new Vector2(width / 2, height / 2),
            relative: new Vector2(width, height).divide(new Vector2(1280, 720)),
            'default': new Vector2(1280, 720)
        };

        this._resolution.full.aspect = resolution.aspect;
        this.three.camera.aspect = resolution.aspect;
    }

    /**
     *
     * @param [variant]
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
     * @protected
     */
    _fullReset() {
        this.needsReset = false;
        this.shapeMaterialsNeedUpdate = false;

        this._reloadPlugins();
        this._resetShapes();
        this._resetLighting();
        this._resetBackground();
        this._updateShaders();
        this._updateShaderPasses();
        this._initListeners();
    }

    /**
     *
     * @param resolution
     * @protected
     */
    _resetSizes(resolution) {

        this._initBoundaries(resolution);

        if (this.three.composer) {
            this.three.composer.setSize(this.resolution().x, this.resolution().y);
        }
    }

    /**
     *
     * @protected
     */
    _resetShapes() {

        this.shapesNeedReset = false;
        this.shapeMaterialsNeedUpdate = false;

        this.resetPlugins();
        this._initRotator();
        this._resetAnimation();

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
     * @protected
     */
    _dispose() {
        let sc = this.three.scene;
        this.settings = false;
        this.controlSets = null;
        this.shapes = null;
        this.plugins = {};
        this._shapes = null;

        sc.remove(this._layer);
        this._layer.traverse(HC.dispose);
        this._lighting = null;
        this._rotation = null;
        this._shapes = null;

        if (this.shape) {
            this.shape.sceneObject().traverse(HC.dispose);
            this.shape = null;
        }

        this._resetAnimation();
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
     * @protected
     */
    _resetAnimation() {
        if (this.tween) {
            this.tween.removeAll();
        }
        this.lastUpdate = 0;
    }

    /**
     *
     * @returns {null|[]}
     * @protected
     */
    _updateShaders() {
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
                    if (li === 0 && sh.index === 0) { // append
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
     * @returns {null|[]}
     * @protected
     */
    _updateShaderPasses() {
        this.shadersNeedUpdate = false;

        let shaders = null;
        let controlSet = this.animation.settingsManager.get(this.index, 'passes');
        let shaderPresets = controlSet.getShaderPasses();

        for (let index in shaderPresets) {

            let shader = controlSet.getShader(index);

            if (shader && shader.apply) {
                let name = controlSet.getShaderName(index);
                let key = controlSet.getShaderPassKey(index);
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
    /**
     *
     * @param x
     * @param y
     * @param z
     * @return {*}
     */
    rotation(x, y, z) {
        if (x !== undefined) {

            x *= RAD;
            y *= -RAD;
            z *= -RAD;

            this._rotation.rotation.set(x, y, z);
        }

        return this._rotation.rotation;
    }

    /**
     *
     * @param x
     * @param y
     * @param z
     */
    position(x, y, z) {
        let cdd = this.cameraDefaultDistance(.25);
        this._rotation.position.set(this.resolution('half').x + x * cdd, -this.resolution('half').y - y * cdd, z * cdd);
    }

    /**
     *
     * @param sh
     * @return {{length}|*}
     */
    shaders(sh) {

        if (sh !== undefined) {
            let composer = this.three.composer;
            composer.passes = [composer.passes[0]];

            composer.reset();

            if (sh && sh.length) {
                let i = 0
                for (; i < sh.length; i++) {
                    let pass = sh[i].create();
                    composer.addPass(pass);
                    pass.renderToScreen = false;
                }

                sh[i - 1].create().renderToScreen = true;
            }

            this._shaders = sh;

        } else {
            sh = this._shaders;
        }

        return sh;
    }

    /**
     *
     * @returns {*|boolean}
     */
    currentSpeed() { // todo: can we move it elsewhere?
        return this.beatKeeper.getSpeed(this.settings.rhythm);
    }

    /**
     *
     * @protected
     */
    _initListeners() {
        let eventManager = EventManager;
        let onError = (e)=>{console.log(e);};
        eventManager.register(EVENT_LAYER_RESET, this.index, () => {
            console.log(EVENT_LAYER_RESET, this.index);
            this.needsReset = true;

            // if layer is not animated right now, do it after some frames
            TimeoutManager.add('_handleResets.' + this.index, SKIP_TEN_FRAMES, () => {
                this._handleResets();
            }, onError);
        });

        eventManager.register(EVENT_SHAPE_MATERIALS_UPDATE, this.index, () => {
            this.shapeMaterialsNeedUpdate = true;
            // if layer is not animated right now, do it after some frames
            TimeoutManager.add('_handleResets.' + this.index, SKIP_TEN_FRAMES, () => {
                this._handleResets();
            }, onError);
        });

        eventManager.register(EVENT_LAYER_RESET_SHAPES, this.index, () => {
            this.shapesNeedReset = true;
            // if layer is not animated right now, do it after some frames
            TimeoutManager.add('_handleResets.' + this.index, SKIP_TEN_FRAMES, () => {
                this._handleResets();
            }, onError);
        });

        eventManager.register(EVENT_LAYER_RESET_LIGHTING, this.index, () => {
            this.lightingNeedsReset = true;
            // if layer is not animated right now, do it after some frames
            TimeoutManager.add('_handleResets.' + this.index, SKIP_TEN_FRAMES, () => {
                this._handleResets();
            }, onError);
        });

        eventManager.register(EVENT_LAYER_RESET_AMBIENT, this.index, () => {
            this.ambientNeedsReset = true;
            // if layer is not animated right now, do it after some frames
            TimeoutManager.add('_handleResets.' + this.index, SKIP_TEN_FRAMES, () => {
                this._handleResets();
            }, onError);
        });

        eventManager.register(EVENT_LAYER_RESET_FOG, this.index, () => {
            this.fogNeedsReset = true;
            // if layer is not animated right now, do it after some frames
            TimeoutManager.add('_handleResets.' + this.index, SKIP_TEN_FRAMES, () => {
                this._handleResets();
            }, onError);
        });

        eventManager.register(EVENT_LAYER_UPDATE_SHADERS, this.index, () => {
            this.shadersNeedUpdate = true;
            // if layer is not animated right now, do it after some frames
            TimeoutManager.add('_handleResets.' + this.index, SKIP_TEN_FRAMES, () => {
                this._handleResets();
            }, onError);
        });
    }
}

export {_Layer as _Layer}