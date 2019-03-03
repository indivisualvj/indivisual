{
    HC.plugins.filter_mode.pulse = class Plugin extends HC.FilterModePlugin {
        apply(shape) {
            let layer = this.layer;

            let speed = layer.getShapeSpeed(shape);
            let color = shape.color;
            let v = 50 + 25 * (HC.Osci.sinInOut(speed.prc));

            v *= this.settings.filter_volume;
            v = Math.abs(cutoff(v, 100));
            color.s = v;
            color.l = v;
        }
    }
}
