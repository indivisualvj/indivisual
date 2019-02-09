HC.plugins.background_mode.transparent = _class(false, HC.BackgroundModePlugin, {
    apply: function () {
        if (this.current() != false) {
            this.layer.setBackground(this.current(false));
        }
    }
});