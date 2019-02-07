/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.plugins = HC.plugins || {};

HC.Shape.prototype.injected = {
    plugins: {}
};

/**
 *
 */
HC.Shape.prototype.initPlugins = function () {

    this.plugins = {};
    var plugins = Object.keys(HC.Shape.prototype.injected.plugins);
    for (var p = 0; p < plugins.length; p++) {
        var key = plugins[p];
        var plugin = HC.Shape.prototype.injected.plugins[key];
        var clone = JSON.parse(JSON.stringify(plugin));
        this.plugins[key] = clone;
    }
};

HC.Plugin = _class(false, false, {

    construct: function (layer, settings, tree, key) {
        this.layer = layer;
        this.settings = settings;
        this.tree = tree;
        this.key = key;
    },

    inject: function () {
        HC.Shape.prototype.injected.plugins[this.tree][this.key] = {
            values: this.injections || {}
        };
    },

    params: function (shape, values) {

        if (values !== undefined) {
            shape.plugins[this.tree][this.key].values = values;
        }

        return shape.plugins[this.tree][this.key].values;
    },

    tween: function (from) {
        return new TWEEN.Tween(from, this.layer.tween);
    },

    tweenShape: function (shape, from, to) {

        var speed = this.layer.getShapeSpeed(shape);
        var delay = this.layer.getShapeDelay(shape);

        var duration = speed.duration;
        var dly = delay.delay;

        // tweens may never be longer than their superordinate delay + duration
        var time = speed.speed.duration-speed.duration-delay.delay-speed.speed.progress;
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
    },

    tweenStart: function (tween) {
        tween.start(HC.now() - this.layer.lastUpdate);
    },

    apply: function () {
        console.error('HC.Plugin: .apply() must be implemented in derived plugin.');
    },

    isFirstShape: function (shape) {
        return shape.index == 0;
    }
});
