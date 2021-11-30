{
    HC.plugins.pattern.lineh = class Plugin extends HC.PatternPlugin {
        static name = 'lineh';

        apply(shape) {
            let layer = this.layer;
            let pos = this.calculate(shape);
            this.positionIn3dSpace(shape, pos.x, pos.y, pos.z);
        }

        calculate(shape) {
            let layer = this.layer;
            let step = layer.resolution().x / layer.shapeCount();
            let cx = layer.resolution('half').x;
            let pos = shape.index * step;
            let dist = cx - pos;
            let padding = this.settings.pattern_padding * this.settings.pattern_paddingx;

            pos = -dist * padding + step * padding / 2;

            let x = pos;
            let y = 0;
            let z = 0;

            return {x: x, y: y, z: z};
        }
    }
}
{
    HC.plugins.pattern.linev = class Plugin extends HC.PatternPlugin {
        static name = 'linev';

        apply(shape) {
            let layer = this.layer;
            let pos = this.calculate(shape);
            this.positionIn3dSpace(shape, pos.x, pos.y, pos.z);
        }

        calculate(shape) {
            let layer = this.layer;
            let step = layer.resolution().y / layer.shapeCount();
            let cy = layer.resolution('half').y;
            let pos = shape.index * step;
            let dist = cy - pos;
            let padding = this.settings.pattern_padding * this.settings.pattern_paddingy;

            pos = -dist * padding + step * padding / 2;

            let x = 0;
            let y = pos;
            let z = 0;

            return {x: x, y: y, z: z};
        }
    }
}
