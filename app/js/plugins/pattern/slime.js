HC.plugins.pattern.slime = _class(
    function () {
        this.next = {x: 0, y: 0, z: 0};
        this.direction = 1;
        this.angle = 0;
    }, HC.PatternPlugin, {
        name: 'slime',

        injections: {
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
        },
        apply: function (shape) {
            var layer = this.layer;

            var params = this.params(shape);
            var speed = layer.getShapeSpeed(shape);

            if (!params.tween && speed.prc == 0) {

                if (this.isFirstShape(shape)) {
                    this.next = layer.random3dPosition(0, 0);
                    this.direction = randomBool() ? -1 : 1;
                    this.angle += randomFloat(0, Math.PI/2, 2) * this.direction;
                }
                params.next.x = this.next.x;
                params.next.y = this.next.y;
                params.next.z = 0;
                params.next.angle = this.angle + (Math.PI / layer.shapeCount() * shape.index) * randomFloat(1/Math.PI, 2/Math.PI, 2);
                params.next.radius = randomInt(layer.shapeSize(1.5), layer.shapeSize(2) * this.settings.pattern_padding);

                var inst = this;
                var tween = this.tweenShape(shape, params.current, params.next);
                tween.easing(TWEEN.Easing.Quadratic.InOut);
                tween.onUpdate(function () {
                    var x = params.current.x + Math.sin(params.current.angle) * params.current.radius;
                    var y = params.current.y + Math.cos(params.current.angle) * params.current.radius;

                    inst.layer.positionIn2dSpace(shape, x, y, 0);

                    var pos = shape.position();
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
);
