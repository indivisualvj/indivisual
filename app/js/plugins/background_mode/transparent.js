HC.plugins.background_mode.transparent = _class(false, HC.BackgroundModePlugin, {
    apply: function () {
        var layer = this.layer;
        if (this.current() != this.settings.background_color) {
            this.layer.setBackground(this.current(''));
        }
    }
});