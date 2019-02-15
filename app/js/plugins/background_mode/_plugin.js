HC.plugins.background_mode = HC.plugins.background_mode || {};

HC.BackgroundModePlugin = _class(false, HC.AnimationPlugin, {
    color: false, // static

    /**
     * Manipulate the static .color property to have a BackgroundMode wide status
     *
     * @param color
     * @returns {boolean}
     */
    current: function (color) {
        if (color !== undefined) {
            HC.BackgroundModePlugin.prototype.color = color;
        }

        return this.color
    }
});
