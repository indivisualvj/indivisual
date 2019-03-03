{
    HC.plugins.oscillate.off = class Plugin extends HC.OscillatePlugin {
        static name = 'off';
        static index = 1;
        // apply is not defined here to avoid plugin execution aka save CPU (haha)
    }
}
