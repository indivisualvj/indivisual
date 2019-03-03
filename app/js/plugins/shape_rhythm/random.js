{
    HC.plugins.shape_rhythm.random = class Plugin extends HC.ShapeRhythmPlugin {
        apply(shape, overwrite) {
            let params = this.params(shape);
            if (!params.speed || overwrite) {
                let keys = Object.keys(beatkeeper.speeds);
                let i = randomInt(2, keys.length - 2);
                let speed = keys[i];
                params.speed = beatkeeper.getSpeed(speed);
            }
        }
    }
}