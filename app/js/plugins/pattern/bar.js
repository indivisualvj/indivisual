{
    HC.plugins.pattern.bar = class Plugin extends HC.PatternPlugin {
        static name = 'bar';
        orientation = 0;
        position = 0;
        injections = {
            next: {
                x: false,
                y: false,
                z: false
            },
            current: {
                x: 0,
                y: 0,
                z: 0
            },
            tween: false
        };

        apply(shape) {
            let layer = this.layer;

            let params = this.params(shape);
            let speed = layer.getShapeSpeed(shape);

            if (!params.tween && speed.prc == 0) {

                if (this.isFirstShape(shape)) {
                    this.orientation = randomBool();
                    this.position = randomInt(0, this.orientation ? layer.resolution('half').y : layer.resolution('half').x, true);
                }

                let from = params.current;
                let to = {
                    x: 0,
                    y: 0,
                };

                if (this.orientation) {
                    to.x = -layer.resolution('half').x + layer.resolution().x / layer.shapeCount() * randomInt(0, layer.shapeCount());
                    to.y = this.position;
                } else {
                    to.x = this.position;
                    to.y = -layer.resolution('half').y + layer.resolution().y / layer.shapeCount() * randomInt(0, layer.shapeCount());
                }

                let tween = this.tweenShape(shape, from, to);
                tween.easing(TWEEN.Easing.Quadratic.InOut);
                tween.onUpdate(function () {
                    layer.positionIn3dSpace(shape, from.x, from.y, from.z);
                });
                tween.onComplete(function () {
                    params.tween = false;
                });
                this.tweenStart(tween);

                params.tween = tween;
            }
        }
    }
}