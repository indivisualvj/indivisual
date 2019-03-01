HC.plugins.background_mode.transparent = _class(false, HC.BackgroundModePlugin, {
    index: 1,
    apply() {
        if (this.current() !== false) {
            this.layer.setBackground(this.current(false));
        }
    }
});