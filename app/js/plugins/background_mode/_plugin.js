HC.plugins.background_mode = HC.plugins.background_mode || {};

HC.BackgroundModePlugin = _class(false, HC.Plugin, {
    color: false, // static

    /**
     * Manipulate the static .color value to have a BackgroundMode wide status
     * todo add static values and manipulation where info hast to be shared?
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
