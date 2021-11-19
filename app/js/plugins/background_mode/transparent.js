{
    HC.plugins.background_mode.transparent = class Plugin extends HC.BackgroundModePlugin {
        static index = 1;

        apply() {
            if (this.needsUpdate()) {
                this.layer.setBackground(this.current(this.id()));
            }
        }
    }
}