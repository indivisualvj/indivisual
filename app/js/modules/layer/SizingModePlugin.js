/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class SizingModePlugin extends HC.AnimationPlugin {
    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.sizing.properties;
    }

    after(shape) {
        if (this.settings.sizing_audio) {
            let of = shape.scale();
            let vo = this.audioAnalyser.volume;
            if (!this.settings.sizing_sync) {
                vo = this.shapeVolume(shape);
            }

            of.multiplyScalar(vo);

            if (this.settings.sizing_limit) {
                of.x = cutoff(of.x, 1);
                of.y = cutoff(of.y, 1);
                of.z = cutoff(of.z, 1);
            }
        }
    }
}

export {SizingModePlugin}
