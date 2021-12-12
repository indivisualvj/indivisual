/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";
import {Vector3} from "three";

class bacillus extends PatternPlugin {
        static name = 'bacillus';
        injections = {velocity: false};

        apply(shape, move) {
            let layer = this.layer;

            let speed = layer.shapeSpeed(shape);
            let params = this.params(shape);

            let prcp = layer.resolution().x / 600;
            let prcn = prcp * -1;

            let avx = randomInt(prcn, prcp) / shape.size() * this.settings.pattern_padding * this.settings.pattern_paddingx;
            let avy = randomInt(move === true ? 0 : prcn, prcp) / shape.size() * this.settings.pattern_padding * this.settings.pattern_paddingy;
            let avz = randomInt(prcn, prcp) / shape.size() * this.settings.pattern_padding * this.settings.pattern_paddingz;

            if (!params.velocity) {
                params.velocity = new Vector3(avx, avy, avz);

                shape.position().copy(this.random2dPosition(0), layer.shapeSize(1));
            }

            let mpc =this.animation.diffPrc * 0.3;
            let accelerator = this.audioAnalyser.peak ? 3.5 : 2.5;

            params.velocity.x += mpc * avx;
            params.velocity.x *= (this.audioAnalyser.peak || speed.progress <= 0) ? accelerator * this.settings.pattern_padding : 0.90;

            // verlangsamen
            if (Math.abs(params.velocity.x) > prcp * 10) {
                params.velocity.x *= 0.7;
                params.velocity.y *= 0.7;
                params.velocity.z *= 0.7;

            } else if (Math.abs(params.velocity.x) > prcp * 8) {
                params.velocity.x *= 0.8;
                params.velocity.y *= 0.8;
                params.velocity.z *= 0.8;
            }

            params.velocity.y += mpc * avy;
            params.velocity.y *= (this.audioAnalyser.peak || speed.progress <= 0) ? accelerator * this.settings.pattern_padding : 0.90;

            // verlangsamen
            if (Math.abs(params.velocity.y) > prcp * 10) {
                params.velocity.y *= 0.7;
                params.velocity.x *= 0.7;
                params.velocity.z *= 0.7;

            } else if (Math.abs(params.velocity.y) > prcp * 8) {
                params.velocity.y *= 0.8;
                params.velocity.x *= 0.8;
                params.velocity.z *= 0.8;
            }

            params.velocity.z += mpc * avz;
            params.velocity.z *= (this.audioAnalyser.peak || speed.progress <= 0) ? accelerator * this.settings.pattern_padding : 0.90;

            // verlangsamen
            if (Math.abs(params.velocity.z) > prcp * 10) {
                params.velocity.y *= 0.7;
                params.velocity.x *= 0.7;
                params.velocity.z *= 0.7;

            } else if (Math.abs(params.velocity.z) > prcp * 8) {
                params.velocity.y *= 0.8;
                params.velocity.x *= 0.8;
                params.velocity.z *= 0.8;
            }

            if (move === true) {

                let dir = this.boundsCheck(shape, layer.shapeSize(shape.size()));
                if (dir.x < 0) {
                    shape.x(-layer.shapeSize(shape.size()));
                } else if (dir.x > 0) {
                    shape.x(layer.resolution().x + layer.shapeSize(shape.size()));
                }
                if (dir.y > 0) {
                    shape.y(-layer.shapeSize(shape.size()));
                } else if (dir.y < 0) {
                    shape.y(layer.resolution().y + layer.shapeSize(shape.size()));
                }

                let a = shape.rotation().z;
                shape.move(
                    params.velocity.y * Math.sin(a),
                    -params.velocity.y * Math.cos(a),
                    0
                );

            } else {
                this.boundsCheck(shape, 0, .75, params.velocity);
                shape.position().add(params.velocity);
            }
        }
    }


class rocket extends bacillus {
        static name = 'rocket';

        apply(shape) {
            super.apply(shape, true);
        }
    }

export {bacillus, rocket};
