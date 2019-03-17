{
    HC.plugins.background_mode.transparent = class Plugin extends HC.BackgroundModePlugin {
        static index = 1;

        apply() {
            if (this.current() !== this.id()) {
                this.layer.setBackground(this.current(this.id()));
            }
        }
    }
}