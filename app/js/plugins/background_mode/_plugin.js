HC.plugins.background_mode = HC.plugins.background_mode || {};

HC.BackgroundModePlugin = _class(false, HC.Plugin, {
    current: function (color) {
        if (color !== undefined) {
            this.color = color;
        }

        return this.color
    }
});
