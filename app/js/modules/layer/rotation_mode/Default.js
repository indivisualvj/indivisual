/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {RotationModePlugin} from "../RotationModePlugin";

const Judder = {
    InOut(v) {
        return Math.floor(v * 10) / 10;
    }
};

class Default extends RotationModePlugin {
    /**
     * @see HC.RotationModePlugin.injections
     */

    apply(shape) {

        let params = this.params(shape);

        if (params.tween) {
            // apply is only called if duration is over.
            // hence, this tween must be overdue and has to be stopped.
            params.tween.stop();
        }

        if (this.layer.getShapeDuration(shape) > 0) {
            this.degrees(shape);
        }

        let easing = this.easing();

        let _onUpdate = function () {
            // console.log('update');
            shape.rotation(params.current.x, params.current.y, params.current.z);
        };
        let _onComplete = function () {
            // console.log('complete');
            params.next.x = params.current.x %= 360;
            params.next.y = params.current.y %= 360;
            params.next.z = params.current.z %= 360;

            params.iterations++;

            params.tween = false;
        };
        let _onStop = function () {
            // console.log('stop');
            params.current.x = params.next.x;
            params.current.y = params.next.y;
            params.current.z = params.next.z;
            _onUpdate();
            _onComplete();
        };

        let tween = this.tweenShape(shape, params.current, params.next);
        tween.easing(easing);
        tween.onUpdate(_onUpdate);
        tween.onComplete(_onComplete);
        tween.onStop(_onStop);
        this.tweenStart(tween);

        params.tween = tween;
    }

    easing() {
        let easing = this.settings.rotation_easing; // todo: screams after a plugin solution
        switch (easing) {
            case 'quint':
                return TWEEN.Easing.Quintic.InOut;

            case 'circ':
                return TWEEN.Easing.Circular.InOut;

            case 'back':
                return TWEEN.Easing.Back.InOut;

            case 'judder':
                return Judder.InOut;

            case 'off':
            default:
                return TWEEN.Easing.Linear.None;

        }
    }

    degrees(shape) {

        let layer = this.layer;
        let params = this.params(shape);

        let degrees = 90;
        let sync = this.settings.rotation_sync;

        if (!sync) {
            degrees = randomInt(Math.round(degrees / 2), degrees);
        }

        let dir = layer.getShapeDirection(shape);
        degrees *= dir;

        let dx = this.settings.rotation_x_volume * degrees;
        let dy = this.settings.rotation_y_volume * degrees;
        let dz = this.settings.rotation_z_volume * degrees;

        if (this.settings.rotation_x && (!this.settings.rotation_x_random || randomBool())) {
            params.next.x += dx;

        } else if (sync) {
            params.next.x = this.correctAngle(params.current.x, this.settings.rotation_x, sync);
        }

        if (this.settings.rotation_y && (!this.settings.rotation_y_random || randomBool())) {
            params.next.y += dy;

        } else if (sync) {
            params.next.y = this.correctAngle(params.current.y, this.settings.rotation_y, sync);
        }

        if (this.settings.rotation_z && (!this.settings.rotation_z_random || randomBool())) {
            params.next.z += dz;

        } else {
            params.next.z = this.correctAngle(params.current.z, this.settings.rotation_z, sync);
        }
    }

    correctAngle(current, enabled, sync) {

        if (!enabled && sync) {
            // rotate back to normal
            if (current > 180) {
                return 360;
            } else {
                return 0;
            }

        } else {
            // if enabled and no sync, just keep and wait for new orders
        }

        return current;
    }
}

export {Default};
