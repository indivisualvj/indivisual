{
    HC.plugins.pattern.ring = class Plugin extends HC.PatternPlugin {
        static name = 'ring';

        apply(shape, sides) {
            let layer = this.layer;

            if (!sides) {
                sides = layer.shapeCount();
            }

            let px = this.settings.pattern_paddingx;
            let py = this.settings.pattern_paddingy;

            let seg = Math.PI * 2 / sides;
            let hseg = -Math.PI * 0.5;

            let r = (Math.min(layer.resolution('half').x, layer.resolution('half').y - layer.shapeSize(1))) * this.settings.pattern_padding;

            let i = shape.index % sides;

            let cos = Math.cos(hseg + seg * i);
            let sin = Math.sin(hseg + seg * i);

            let x = cos * r * px;
            let y = sin * r * py;
            let z = 0;

            layer.positionIn3dSpace(shape, x, -y, z);
        }
    }
}
{
    HC.plugins.pattern.triangle = class Plugin extends HC.PatternPlugin {
        static name = 'triangle';

        apply(shape) {
            let layer = this.layer;
            layer.getPatternPlugin('ring').apply(shape, 3);
        }
    }
}
{
    HC.plugins.pattern.lightspeed = class Plugin extends HC.PatternPlugin {
        static name = 'lightspeed';

        apply(shape) {
            let layer = this.layer;


            let x, y, z = shape.z();

            if (z == 0 || z > layer.cameraDefaultDistance()) {
                z = randomInt(-100000, -5000, false);

            } else {
                z += animation.diff * 10 * this.settings.pattern_paddingz;
            }

            layer.getPatternPlugin('ring').apply(shape);
            x = shape.x();
            y = shape.y();

            shape.position(x, y, z);
        }
    }
}
