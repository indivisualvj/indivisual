/**
 * Keep in mind: If durations in HC.Beatkeeper.speeds change due to pitching, this will not return usable values for smooth animations.
 * @param duration
 * @param divider
 * @returns {number}
 */
HC.Animation.prototype.getFrameDurationPercent = function (duration, divider) {
    return this.diffPrc * this.duration / (duration * (divider || 1));
};

/**
 *
 */
HC.Animation.prototype.doShuffle = function () {
    var plugin = this.getShuffleModePlugin(statics.ControlSettings.shuffle_mode);

    var result = plugin.apply();
    if (result !== false) {
        result = plugin.after();
        if (result !== false) {
            renderer.nextLayer = renderer.layers[result];
        }
    }
};

/**
 *
 * @param name
 */
HC.Animation.prototype.getShuffleModePlugin = function (name) {
    if (!this.plugins) {
        this.plugins = {};
    }

    if (!this.plugins[name]) {
        this.plugins[name] = new HC.shuffle_mode[name](statics.ControlSettings);
    }

    return this.plugins[name];
};