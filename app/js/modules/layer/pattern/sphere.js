/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";

class sphere extends PatternPlugin {
        static name = 'sphere';
        points = {};

        apply(shape) {
            let layer = this.layer;


            let point = this.spherePosition(shape);
            let radius = layer.resolution('half').y * this.settings.pattern_padding;

            if (this.settings.pattern_audio) {
                let or = radius;
                if (this.settings.pattern_sync) {
                    radius *= this.audioAnalyser.volume;
                } else {
                    radius *= this.shapeVolume(shape);
                }

                if (this.settings.pattern_limit) {
                    radius = or + radius;
                }
            }

            let px = this.settings.pattern_paddingx;
            let py = this.settings.pattern_paddingy;
            let pz = this.settings.pattern_paddingz;
            let x = point.x * radius * px;
            let y = point.y * radius * py;
            let z = point.z * radius * pz;

            this.positionIn3dSpace(shape, x, y, z);
        }

        getDistributionOnSphere(n) {
            let rnd = 1;
            let offset = 2 / n;
            let increment = Math.PI * (3 - Math.sqrt(5));

            return Array(n).fill(null).map(function (_, i) {
                let y = i * offset - 1 + offset / 2;
                let r = Math.sqrt(1 - Math.pow(y, 2));
                let phi = (i + rnd) % n * increment;

                return {
                    x: Math.cos(phi) * r,
                    z: Math.sin(phi) * r,
                    y: y
                };

            });
        }

        spherePosition(shape) {
            let layer = this.layer;
            if (!this.points || this.points.length !== layer.shapeCount()) {
                this.points = this.getDistributionOnSphere(layer.shapeCount());
            }

            return this.points[shape.index] || {x: 0, y: 0, z: 0};
        }
    }


class spray extends PatternPlugin {
        static name = 'spray';
        injections = {initial: false, velocity: false};

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);

            if (!params.initial
                || shape.y() < 0 - layer.shapeSize(1)
                || shape.y() > layer.resolution().y + layer.shapeSize(1)
                || shape.x() < 0 - layer.shapeSize(1)
                || shape.x() > layer.resolution().x + layer.shapeSize(1)
            ) {
                layer.getPatternPlugin('sphere').apply(shape);
                let sp = shape.position().clone();
                let cv = this.patternCenterVector(true);
                sp.sub(cv);
                params.initial = sp;
                shape.position().copy(cv);

                params.velocity = randomFloat(0.1, 1, 2, false);
            }

            let v = this.settings.pattern_audio === true
                ? ((this.settings.pattern_sync === false
                    ? this.shapeVolume(shape) : this.audioAnalyser.volume) * this.settings.pattern_padding) : 1;

            if (this.audioAnalyser.peak) {
                params.velocity *= 1.5;

            } else if (params.velocity > 1.5) {
                params.velocity *= 0.9;
            }

            let frame = params.velocity * this.animation.diff / 350;

            shape.move(
                params.initial.x * frame,
                params.initial.y * -frame,
                params.initial.z * frame
            );
        }
    }


class pulse extends PatternPlugin {
        static name = 'pulse';
        injections = {
            initial: false,
            velocity: false,
            volume: false
        };

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);

            if (!params.initial
                || shape.y() < 0 - layer.shapeSize(1)
                || shape.y() > layer.resolution().y + layer.shapeSize(1)
                || shape.x() < 0 - layer.shapeSize(1)
                || shape.x() > layer.resolution().x + layer.shapeSize(1)
                || shape.z() > layer.cameraDefaultDistance()
                || shape.z() < -layer.cameraDefaultDistance()
            ) {
                layer.getPatternPlugin('sphere').apply(shape);
                let sp = shape.position().clone();
                let cv = this.patternCenterVector(true);
                sp.sub(cv);
                params.initial = sp;
                shape.position().copy(cv);

                params.velocity = randomFloat(.1, 1, 2);

            }

            let speed = layer.shapeSpeed(shape);
            if (speed.progress < 1) { //
                params.velocity *= -1;

            } else if (this.animation.audioManager.isActive()) {
                if (this.audioAnalyser.peak) {
                    params.volume = this.settings.pattern_sync === false
                        ? this.shapeVolume(shape) : this.audioAnalyser.volume;
                    params.velocity *= -1;

                } else if (params.volume > 0) {
                    params.volume -= 0.00001 * this.animation.diff;
                }
            }

            let frame = params.velocity * this.animation.diff / 250;

            shape.move(
                params.initial.x * frame,
                params.initial.y * -frame,
                params.initial.z * frame
            );
        }
    }


class drift extends PatternPlugin {
        static name = 'drift';

        apply(shape) {
            let layer = this.layer;
            layer.getPatternPlugin('spray').apply(shape);
        }
    }

export {spray, sphere, pulse, drift};
