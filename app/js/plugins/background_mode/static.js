{
    HC.plugins.background_mode.static = class Plugin extends HC.BackgroundModePlugin {
        static index = 20;

        apply() {
            if (this.current() != this._settingID()) {
                this.current(this._settingID());
                this.layer.setBackground(new THREE.Color(this.settings.background_color));
            }
        }
    }
}