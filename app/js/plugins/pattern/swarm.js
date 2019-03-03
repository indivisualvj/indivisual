HC.plugins.pattern.swarm = _class(
    function (layer) {
        this.randshapes = this.randshapes(layer.shapeCount());
        this.shared = {
            locking: {
                disabled: true// @see plugins/shape_lookat
            }
        };
    }, HC.PatternPlugin, {
        static name = 'swarm';
        injections = {
            targetLook: false,
            shape: false,
            tween: false,
            timeout: false
        },

        before(shape) {
            var layer = this.layer;
            var params = this.params(shape);
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
        },

        apply(shape) {
            this.lookAt(shape, true);
            this.move(shape);

        },

        randPosition(params, shape) {
            var rand = this.layer.random3dPosition(.5, 0);
            params.targetLook.copy(rand);
            if (shape) {
                this.randshapes.add(shape);
            }
        },

        move(shape) {
            var layer = this.layer;
            var params = this.params(shape);
            var speed = params.speed;
            var wp = new THREE.Vector3();
            shape.getWorldPosition(wp);
            var dist = wp.distanceTo(params.targetLook);

            var s = 10 * this.settings.pattern_padding * animation.getFrameDurationPercent(speed.duration, .125 / 4);
            var m = this.settings.pattern_limit ? 1 : Math.min(1, dist / layer.shapeSize(2));
            var v = s * m;
            if (this.settings.pattern_audio) {
                if (this.settings.pattern_sync) {
                    v *= audio.volume;
                } else {
                    v *= shape.shapeVolume();
                }

                v *= 2;
            }
            shape.sceneObject().translateZ(Math.sqrt(v));

        },

        lookAt(shape, peak) {
            var params = this.params(shape);
            var speed = params.speed;
            params.timeout = (speed.prc == 0 && speed.speed.beats % 4 == 0);

            var restart = speed.prc == 0;

            if ((!params.tween && restart) || params.timeout) {
                this.nextTarget(shape, peak);
            }

            this.lookTween(shape);
        },

        nextTarget(shape, peak) {
            var layer = this.layer;
            var params = this.params(shape);
            var cam = shape.sceneObject();

            params.tween = true;
            params.shape = false;

            var dir = this.boundsCheck(shape);
            if (dir.length() || this.shapeFollowers(shape) || (peak && audio.peak)) {
                // shape is out of bounds or already followed: turn to point inbound
                this.randPosition(params, shape);

            } else {

                var bro = this.randshapes.get() || layer.getRandomShape();
                var dist = bro ? bro.position().distanceTo(cam.position) : 0;

                if (bro != shape && dist > layer.shapeSize(1)) {
                    // turn to another shape
                    bro.getWorldPosition(params.targetLook);
                    params.shape = bro;
                    this.randshapes.remove(shape);

                } else {
                    // turn to random point
                    var rand = layer.random3dPosition(.5, 0);
                    params.targetLook.copy(rand);
                    this.randPosition(params, shape);
                }
            }
        },

        lookTween(shape) {
            var params = this.params(shape);
            var speed = params.speed;
            var cam = shape.sceneObject();

            if (params.shape) {
                params.shape.getWorldPosition(params.targetLook);
            }

            params.quatFrom = new THREE.Quaternion().copy(cam.quaternion);
            cam.lookAt(params.targetLook);
            params.quatTo = new THREE.Quaternion().copy(cam.quaternion);
            cam.quaternion.copy(params.quatFrom);

            var step = animation.getFrameDurationPercent(speed.duration, .25);
            var angle = cam.quaternion.angleTo(params.quatTo);
            var m = Math.sqrt(angle + step * this.settings.pattern_padding);

            if (angle < 0.05) {
                params.tween = false;
                cam.lookAt(params.targetLook);
            } else {
                cam.quaternion.rotateTowards(params.quatTo, step * m);
            }
        },

        randshapes(shapecount) {
            this.shapecount = shapecount;
            this.shapes = {};

            this.get = function () {
                var k = Object.keys(this.shapes);
                if (k.length) {
                    k = k[0];
                    var s = this.shapes[k];

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
);
//
{
// HC.plugins.pattern.swarmpeak = class Plugin extends HC.PatternPlugin {
//     static name = 'swarm on peak';
//     before(shape) {
//         return this.layer.getPatternPlugin('swarm').before(shape);
//     },
//     apply(shape) {
//         this.layer.getPatternPlugin('swarm').apply(shape, true);
//     }
// });
