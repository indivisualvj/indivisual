/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {audio} from "./Audio";
import {waveall} from "./Wave";
import {mul} from "three/examples/jsm/renderers/nodes/ShaderNode";
import {Oscillators} from "../../../shared/Oscillators";

class BounceAudio extends audio
{
    static name = 'bounce (audio->peak)';

    multiplier = 0;

    apply(shape) {

        if (this.audioAnalyser.peak) {
            this.multiplier = this.audioAnalyser.volume * 3 * this.settings.shape_transform_volume;
        }

        if (this.multiplier > 0) {
            let transformVolume = this.settings.shape_transform_volume;
            let limit = this.settings.shape_limit;
            this.settings.shape_limit = true;
            this.settings.shape_transform_volume = this.multiplier;
            super.apply(shape);
            this.multiplier -= .025 * this.animation.diffPrc;
            this.settings.shape_transform_volume = transformVolume;
            this.settings.shape_limit = limit;
        }
    }
}

class BounceWave extends waveall
{
    static name = 'bounce (wave->peak)';

    multiplier = 0;

    apply(shape, activate, multiplier) {
        activate = activate ?? this.audioAnalyser.peak;
        if (activate) {
            this.multiplier = multiplier ?? this.settings.shape_transform_volume;
        }

        if (this.multiplier > 0 || multiplier !== undefined) {
            let transformVolume = this.settings.shape_transform_volume;
            let limit = this.settings.shape_limit;
            this.settings.shape_limit = true;
            this.settings.shape_transform_volume = this.multiplier;

            super.apply(shape);

            this.settings.shape_transform_volume = transformVolume;
            this.settings.shape_limit = limit;

            if (multiplier) {
                this.multiplier = this.settings.shape_transform_volume * TWEEN.Easing.Circular.InOut(multiplier);

            } else {
                this.multiplier -= .025 * this.animation.diffPrc;
            }

        }
    }
}

class BounceWaveQuarter extends BounceWave
{
    static name = 'bounce (wave->quarters)'

    apply(shape, speed) {
        speed = speed ?? this.beatKeeper.getSpeed('quarter');
        let prc = speed.prc;
        prc = this.settings.shape_limit ? Oscillators.cosInOut(prc)
            : this.settings.shape_sync ? 1 - prc
                : prc;

        super.apply(shape, speed.starting(), prc);
    }
}

class BounceWaveHalf extends BounceWaveQuarter
{
    static name = 'bounce (wave->halfs)'
    apply(shape) {
        let speed = this.beatKeeper.getSpeed('half');
        super.apply(shape, speed);
    }
}

export {BounceAudio, BounceWave, BounceWaveQuarter, BounceWaveHalf};
