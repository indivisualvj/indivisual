{
    HC.plugins.pattern.swarm = class Plugin extends HC.PatternPlugin {
        static name = 'swarm';
        shared = {
            locking: {
                disabled: true// @see plugins/shape_lookat
            }
        };
        injections = {
            targetLook: false,
            shape: false,
            tween: false,
            timeout: false
        };
        randshapes = false;

        before(shape) {
            if (!this.randshapes) {
                this.randshapes = this._randshapes(layer.shapeCount());
            }

            let layer = this.layer;
            let params = this.params(shape);
            if (!params.targetLook) {
                this.settings.pattern_padding *= 2;
                layer.getPatternPlugin('cube').apply(shape);
                this.settings.pattern_padding /= 2;

                params.targetLook = new THREE.Vector3();
                this.randPosition(params);
            }
            params.speed = layer.getShapeSpeed(shape);
            if (!params.speed) {
                params.speed = layer.getCurrentSpeed();
            }
        }

        apply(shape) {
            this.lookAt(shape, true);
            this.move(shape);

        }

        randPosition(params, shape) {
            let rand = this.layer.random3dPosition(.5, 0);
            params.targetLook.copy(rand);
            if (shape) {
                this.randshapes.add(shape);
            }
        }

        move(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            let speed = params.speed;
            let wp = new THREE.Vector3();
            shape.getWorldPosition(wp);
            let dist = wp.distanceTo(params.targetLook);

            let s = 20 * this.settings.pattern_padding * this.animation.getFrameDurationPercent(speed.duration, .125 / 4);
            let m = this.settings.pattern_limit ? 1 : Math.min(1, dist / layer.shapeSize(2));
            let v = s * m;
            if (this.animation.audioManager.isActive() && this.settings.pattern_audio) {
                if (this.settings.pattern_sync) {
                    v *= this.audioAnalyser.volume;
                } else {
                    v *= shape.shapeVolume();
                }

                v *= 2;
            }
            shape.sceneObject().translateZ(Math.sqrt(v));

        }

        lookAt(shape, peak) {
            let params = this.params(shape);
            let speed = params.speed;
            params.timeout = (speed.prc == 0 && speed.speed.beats % 4 == 0);

            let restart = speed.prc == 0;

            if ((!params.tween && restart) || params.timeout) {
                this.nextTarget(shape, peak);
            }

            this.lookTween(shape);
        }

        nextTarget(shape, peak) {
            let layer = this.layer;
            let params = this.params(shape);
            let cam = shape.sceneObject();

            params.tween = true;
            params.shape = false;

            let dir = this.boundsCheck(shape);
            if (dir.length() || this.shapeFollowers(shape) || (peak && this.audioAnalyser.peak)) {
                // shape is out of bounds or already followed: turn to point inbound
                this.randPosition(params, shape);

            } else {

                let bro = this.randshapes.get() || layer.getRandomShape();
                let dist = bro ? bro.position().distanceTo(cam.position) : 0;

                if (bro != shape && dist > layer.shapeSize(1)) {
                    // turn to another shape
                    bro.getWorldPosition(params.targetLook);
                    params.shape = bro;
                    this.randshapes.remove(shape);

                } else {
                    // turn to random point
                    let rand = layer.random3dPosition(.5, 0);
                    params.targetLook.copy(rand);
                    this.randPosition(params, shape);
                }
            }
        }

        lookTween(shape) {
            let params = this.params(shape);
            let speed = params.speed;
            let cam = shape.sceneObject();

            if (params.shape) {
                params.shape.getWorldPosition(params.targetLook);
            }

            params.quatFrom = new THREE.Quaternion().copy(cam.quaternion);
            cam.lookAt(params.targetLook);
            params.quatTo = new THREE.Quaternion().copy(cam.quaternion);
            cam.quaternion.copy(params.quatFrom);

            let step = this.animation.getFrameDurationPercent(speed.duration, .25);
            let angle = cam.quaternion.angleTo(params.quatTo);
            let m = Math.sqrt(angle + step * this.settings.pattern_padding);

            if (angle < 0.05) {
                params.tween = false;
                cam.lookAt(params.targetLook);
            } else {
                cam.quaternion.rotateTowards(params.quatTo, step * m);
            }
        }

        /**
         *
         * @param shapecount
         * @returns {HC.plugins.pattern.Plugin}
         * @private
         */
        _randshapes(shapecount) {
            this.shapecount = shapecount;
            this.shapes = {};

            this.get = function () {
                let k = Object.keys(this.shapes);
                if (k.length) {
                    k = k[0];
                    let s = this.shapes[k];

                    if (s.followers < this.shapecount / 20) {
                        s.followers++;
                        return s.shape;

                    } else {
                        this.remove(s.shape);
                    }
                }

                return false;
            };

            this.add = function (shape) {
                this.shapes[shape.index] = {shape: shape, followers: 0};
            };

            this.shapeFollowers = function (shape) {
                if (shape.index in this.shapes) {
                    return this.shapes[shape.index].followers;
                }

                return 0;
            };

            this.remove = function (shape) {
                if (shape.index in this.shapes) {
                    delete this.shapes[shape.index];
                }
            };

            return this;
        }
    }
}
