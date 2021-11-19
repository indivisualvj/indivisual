{
    HC.plugins.background_mode.static = class Plugin extends HC.BackgroundModePlugin {
        static index = 10;
        static tutorial = {
            color: {
                text: 'set background_color to any hex code (#ffaabb) to change color'
            }
        };

        apply() {
            if (this.needsUpdate()) {
                this.current(this.id());
                this.layer.setBackground(new THREE.Color(this.settings.background_color));
            }
        }
    }
}