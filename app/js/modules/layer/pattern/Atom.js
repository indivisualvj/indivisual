/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";

class atom extends PatternPlugin {
        static name = 'atom';
        next = {x: 0, y: 0, z: 0};
        injections = {
            current: {x: 0, y: 0, z: 0}
        };

        apply(shape) {
            let layer = this.layer;

            let speed = layer.shapeSpeed(shape);
            let params = this.params(shape);

            if (!params.tween && speed.prc === 0) {

                if (this.isFirstShape(shape)) {
                    this.next = this.random3dPosition(.5, layer.shapeSize(1));
                }

                let tween = this.tweenShape(shape, params.current, this.next);
                tween.easing(TWEEN.Easing.Quadratic.InOut);
                tween.onUpdate(() => {
                    this.positionIn3dSpace(shape, params.current.x, params.current.y, params.current.z);
                });
                tween.onComplete(function () {
                    params.tween = false;
                });
                this.tweenStart(tween);

                params.tween = tween;
            }
        }
    }

export {atom};
