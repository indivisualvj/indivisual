{
    HC.shuffle_mode.off = class Plugin extends HC.ShuffleModePlugin {
        static index = 1;

        apply() {
            return false;
        }
    }
}