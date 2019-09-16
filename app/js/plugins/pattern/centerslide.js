{
    HC.plugins.pattern.centerslide = class Plugin extends HC.PatternPlugin {
        static name = 'centerslide';
        injections = {
            next: {x: 0, y: 0, z: 0},
            current: {x: 0, y: 0, z: 0}
        };

        apply(shape) {
            let layer = this.layer;

            let speed = layer.getShapeSpeed(shape);
            let params = this.params(shape);

            if (!params.tween && speed.prc == 0) {

                let size = layer.shapeSize(1);
                let hsc = Math.floor(layer.shapeCount() / 2);
                let p = this.settings.pattern_padding * this.settings.pattern_paddingx;
                let w = layer.resolution().x * p;
                // let h = layer.resolution().y;

                if (shape.index < hsc) {
                    params.current.x = w/-2 - size;
                } else {
                    params.current.x = w/2 + size;
                }
                params.current.y = 0;
                params.current.z = 0;

                params.next = {
                    x: 0,
                    y: 0,
                    z: 0
                };

                let tween = this.tweenShape(shape, params.current, params.next);
                tween.easing(TWEEN.Easing.Quadratic.InOut);
                tween.onUpdate(function () {
                    layer.positionIn3dSpace(shape, params.current.x, params.current.y, params.current.z);
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