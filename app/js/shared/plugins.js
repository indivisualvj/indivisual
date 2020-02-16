/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.plugins = HC.plugins || {};

HC.Shape.prototype.injected = {
    plugins: {},
};

/**
 *
 */
HC.Shape.prototype.initPlugins = function () {

    if (!HC.Shape.prototype._plugins) {
        HC.Shape.prototype._plugins = {};
        let plugins = Object.keys(HC.Shape.prototype.injected.plugins);
        for (let p = 0; p < plugins.length; p++) {
            let key = plugins[p];
            let plugin = HC.Shape.prototype.injected.plugins[key];
            let clone = JSON.parse(JSON.stringify(plugin));
            HC.Shape.prototype._plugins[key] = clone;
        }
    }

    this.plugins = JSON.parse(JSON.stringify(HC.Shape.prototype._plugins));
};
{
    /**
     *
     * @type {HC.AnimationPlugin}
     */
    HC.AnimationPlugin = class AnimationPlugin {

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
         * @type {HC.AudioAnalyser}
         */
        audioAnalyser;

        /**
         * @type {HC.Layer}
         */
        layer;
        settings;
        controlSets;
        tree;
        key;
        
        id(suffix) {
            return this.layer.index + '.' + this.tree + '.' + this.key + (suffix!==undefined?'.' + suffix:'');
        }

        /**
         *
         * @param {HC.Shape} shape
         * @returns {*}
         */
        shapeVolume(shape) {
            let i = shape.index % this.audioAnalyser.volumes.length;
            return this.audioAnalyser.volumes[i];
        }

        /**
         *
         * @param {HC.Animation} animation
         * @param {HC.Layer} layer
         * @param settings
         * @param tree
         * @param key
         * @returns {HC.AnimationPlugin}
         */
        construct(animation, layer, settings, tree, key) {
            this.animation = animation;
            this.config = animation.config;
            this.beatKeeper = animation.beatKeeper;
            this.audioAnalyser = animation.audioAnalyser;
            this.layer = layer;
            this.settings = settings;
            this.tree = tree;
            this.key = key;

            this.init();

            return this;
        }

        /**
         * use this for custom code on construction
         */
        init() {
            //
        }

        setControlSets(controlSets) {
            this.controlSets = controlSets;
        }

        inject() {
            let inst = this;
            HC.Shape.prototype.injected.plugins[this.tree][this.key] = {
                values: inst.injections || {}
            };
        }

        params(shape, values) {

            if (values !== undefined) {
                shape.plugins[this.tree][this.key].values = values;
            }

            return shape.plugins[this.tree][this.key].values;
        }

        tween(from) {
            return new TWEEN.Tween(from, this.layer.tween);
        }

        tweenShape(shape, from, to) {

            let speed = this.layer.getShapeSpeed(shape);
            let delay = this.layer.getShapeDelay(shape);

            let duration = speed.duration;
            let dly = delay.delay;

            // tweens may never be longer than their superordinate delay + duration
            let time = speed.speed.duration - speed.duration - delay.delay - speed.speed.progress;
            if (time < 0) {
                time = Math.abs(time) + 5;
                if (delay.delay > time) {
                    dly -= time;

                } else if (speed.duration > time) {
                    duration -= time;
                }
            }

            return this.tween(from)
                .to(to, duration)
                .delay(dly);
        }

        /**
         * Start tweens synchronized
         * @param tween
         */
        tweenStart(tween) {
            tween.start(this.animation.now - this.layer.lastUpdate);
        }

        /**
         * Prepare etc.
         * Using isFirstShape plugins can be cancelled here if processing all shapes is not necessary.
         * @returns {boolean} true means continue, false means stop (do not call apply+after)
         */
        //before () {}

        /**
         *
         * @returns {boolean} true means continue, false means stop (do not call after)
         */
        // apply () {}

        /**
         * Clean up etc.
         */

        // after () {}

        /**
         * For plugins to determine if it is first or layer's dummy shape.
         * @see before
         * @param shape
         * @returns {boolean}
         */
        isFirstShape(shape) {
            return shape.index == 0;
        }

        /**
         *
         * @returns {boolean}
         */
        ready() {
            return true;
        }
    }
}
{
    HC.AnimationTexturePlugin = class AnimationTexturePlugin extends HC.AnimationPlugin {
        /**
         *
         * @param texture
         * @param prefix
         */
        updateTexture(texture, prefix) {
            let wraps = THREE[this.settings[prefix + '_wraps']];
            if (texture.wrapS != wraps) { // todo controlsets last change instead!?
                texture.wrapS = wraps;
                if (texture.image) {
                    texture.needsUpdate = true;
                }
            }
            let wrapt = THREE[this.settings[prefix + '_wrapt']];
            if (texture.wrapT != wrapt) {
                texture.wrapT = wrapt;
                if (texture.image) {
                    texture.needsUpdate = true;
                }
            }

            texture.repeat.set(this.settings[prefix + '_repeatx'], this.settings[prefix + '_repeaty']);
            texture.offset.set(-this.settings[prefix + '_offsetx'], this.settings[prefix + '_offsety']);
            texture.rotation = RAD * this.settings[prefix + '_rotation'];
            texture.center.set(this.settings[prefix + '_centerx'], this.settings[prefix + '_centery']);
        }
    }
}
