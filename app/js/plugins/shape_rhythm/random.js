{
    HC.plugins.shape_rhythm.random = class Plugin extends HC.ShapeRhythmPlugin {
        apply(shape) {
            let params = this.params(shape);

            if (!params.speed) {
                let keys = Object.keys(beatKeeper.speeds);
                let i = randomInt(2, keys.length - 2);
                let speed = keys[i];
                params.speed = beatKeeper.getSpeed(speed);
            }
        }
    }
}
