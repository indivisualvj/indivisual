/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {LightingLookatPlugin} from "../LightingLookatPlugin";

class randomshape extends LightingLookatPlugin {
    apply(light, peak) {
        if (this.isFirstShape(light)) {
            let speed = this.layer.currentSpeed();
            if (!this.shape || (!peak && speed.prc === 0) || (peak && this.audioAnalyser.peak && randomBool())) {
                this.shape = this.layer.randomShape();
            }
        }

        if (light.target !== this.shape.mesh) {
            light.target = this.shape.mesh;
        }
    }
}


class randomshapepeak extends LightingLookatPlugin {
    apply(light) {
        this.layer.getLightingLookatPlugin('randomshape').apply(light, true);
    }
}


class randomshapes extends LightingLookatPlugin {
    apply(light, peak) {
        let params = this.params(light);
        let speed = params.speed || this.layer.currentSpeed();

        if (params.shape && params.shape.parent !== this.layer) {
            params.shape = false;
        }

        if (!params.shape || (!peak && speed.prc === 0) || (peak && this.audioAnalyser.peak && randomBool())) {
            params.shape = this.layer.randomShape();
            params.speed = this.layer.shapeSpeed(params.shape).speed;
        }

        if (light.target !== params.shape.mesh) {
            light.target = params.shape.mesh;
        }
    }
}


class randomshapespeak extends LightingLookatPlugin {
    apply(light) {
        this.layer.getLightingLookatPlugin('randomshapes').apply(light, true);
    }
}


export {randomshape, randomshapespeak, randomshapes, randomshapepeak};
