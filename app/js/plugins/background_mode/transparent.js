{
    HC.plugins.background_mode.transparent = class Plugin extends HC.BackgroundModePlugin {
        static index = 1;

        apply() {
            if (this.current() !== false) {
                this.layer.setBackground(this.current(false));
            }
        }
    }
}