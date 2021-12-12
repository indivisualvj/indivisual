/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../AnimationPlugin";

class OffsetModePlugin extends AnimationPlugin {

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.offset.properties;
    }

    after(shape) {
        let layer = this.layer;
        if (this.settings.offset_audio && this.animation.audioManager.isActive()) {
            let of = shape.offset();
            let vo = this.audioAnalyser.volume;
            if (!this.settings.offset_sync) {
                vo = this.shapeVolume(shape);
            }

            of.multiplyScalar(vo);

            if (this.settings.offset_limit) {
                let ss = layer.shapeSize(1);
                of.x = cutoff(of.x, ss);
                of.y = cutoff(of.y, ss);
                of.z = cutoff(of.z, ss);
            }
        }
    }
}

export {OffsetModePlugin}
