HC.plugins.background_mode.static = _class(false, HC.BackgroundModePlugin, {
    apply: function () {
        if (this.current() != this._settingID()) {
            this.current(this._settingID());
            this.layer.setBackground(new THREE.Color(this.settings.background_color));
        }
    }
});