{
    class Plugin extends HC.AudioPlugin {
        static index = 1;
        init(callback) {}
    }

    HC.audio.off = Plugin;
}