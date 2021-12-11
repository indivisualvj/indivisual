/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";

class slime extends PatternPlugin {
        static name = 'slime';
        next = {x: 0, y: 0, z: 0};
        direction = 1;
        angle = 0;
        injections = {
            tween: false,
            next: {
                x: 0,
                y: 0,
                z: 0,
                angle: 0,
                radius: 50
            },
            current: {
                x: 0,
                y: 0,
                z: 0,
                angle: 0,
                radius: 50
            }
        };

        apply(shape) {
            let layer = this.layer;

            let params = this.params(shape);
            let speed = layer.shapeSpeed(shape);

            if (!params.tween && speed.prc === 0) {

                if (this.isFirstShape(shape)) {
                    this.next = this.random3dPosition(0, 0);
                    this.direction = randomBool() ? -1 : 1;
                    this.angle += randomFloat(0, Math.PI / 2, 2) * this.direction;
                }
                params.next.x = this.next.x;
                params.next.y = this.next.y;
                params.next.z = 0;
                params.next.angle = this.angle + (Math.PI / layer.shapeCount() * shape.index) * randomFloat(1 / Math.PI, 2 / Math.PI, 2);
                params.next.radius = randomInt(layer.shapeSize(1.5), layer.shapeSize(2) * this.settings.pattern_padding);

                let tween = this.tweenShape(shape, params.current, params.next);
                tween.easing(TWEEN.Easing.Quadratic.InOut);
                tween.onUpdate(() => {
                    let x = params.current.x + Math.sin(params.current.angle) * params.current.radius;
                    let y = params.current.y + Math.cos(params.current.angle) * params.current.radius;

                    this.positionIn2dSpace(shape, x, y, 0);

                    let pos = shape.position();
                    if (pos.x > layer.resolution().x) {
                        pos.x = layer.resolution().x;
                    }
                    if (pos.x < 0) {
                        pos.x = 0;
                    }
                    if (pos.y < -layer.resolution().y) {
                        pos.y = -layer.resolution().y;
                    }
                    if (pos.y > 0) {
                        pos.y = 0;
                    }

                });
                tween.onComplete(function () {
                    params.tween = false;
                });

                this.tweenStart(tween);
                params.tween = tween;
            }
        }
    }

export {slime};
