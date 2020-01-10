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
        var plugins = Object.keys(HC.Shape.prototype.injected.plugins);
        for (var p = 0; p < plugins.length; p++) {
            var key = plugins[p];
            var plugin = HC.Shape.prototype.injected.plugins[key];
            var clone = JSON.parse(JSON.stringify(plugin));
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

        layer;
        settings;
        controlsets;
        tree;
        key;
        
        id(suffix) {
            return this.layer.index + '.' + this.tree + '.' + this.key + (suffix!==undefined?'.' + suffix:'');
        }

        construct(layer, settings, tree, key) {
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

        setControlSets(controlsets) {
            this.controlsets = controlsets;
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

            var speed = this.layer.getShapeSpeed(shape);
            var delay = this.layer.getShapeDelay(shape);

            var duration = speed.duration;
            var dly = delay.delay;

            // tweens may never be longer than their superordinate delay + duration
            var time = speed.speed.duration - speed.duration - delay.delay - speed.speed.progress;
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
            tween.start(animation.now - this.layer.lastUpdate);
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
            if (texture.wrapS != wraps) {
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
