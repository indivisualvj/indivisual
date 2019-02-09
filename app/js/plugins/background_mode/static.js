HC.plugins.background_mode.static = _class(false, HC.BackgroundModePlugin, {
    apply: function () {
        if (this.current() != this.settings.background_color) {
            this.layer.setBackground(new THREE.Color(this.current(this.settings.background_color)));
        }
    }
});