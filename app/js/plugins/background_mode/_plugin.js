HC.plugins.background_mode = HC.plugins.background_mode || {};

HC.BackgroundModePlugin = _class(false, HC.AnimationPlugin, {
    background: false, // static

    /**
     * Manipulate the static .color property to have a BackgroundMode wide status
     *
     * @param background
     * @returns {boolean}
     */
    current: function (background) {
        if (background !== undefined) {
            HC.BackgroundModePlugin.prototype.background = background;
        }

        return HC.BackgroundModePlugin.prototype.background;
    },

    _settingID: function () {
        return this._id() + this.settings.background_volume + this.settings.background_color;
    },

    dispose: function () {
        this.current('');
    }
});
