{
    HC.plugins.pattern.pass = class Plugin extends HC.PatternPlugin {
        static name = 'pass horizontal';
        dir = 1;
        injections = {
            velocity: false
        };

        before(shape) {
            let params = this.params(shape);
            if (!params.velocity) {
                let matrix = this.layer.getPatternPlugin('matrix');
                matrix.apply(shape);
            }
        }

        apply(shape, peak) {
            let layer = this.layer;
            let matrix = layer.getPatternPlugin('matrix');
            let gridPosition = matrix.gridPosition(shape);
            let params = this.params(shape);
            let shapeSpeed = layer.getShapeRhythmPlugin(this.settings.shape_rhythm).params(shape);

            if (this.isFirstShape(shape) && randomBool()) {
                if (this.layer.settings.pattern_sync) {
                    this.dir = -1;

                } else if ((!peak && layer.currentSpeed().prc === 0) || (peak && this.audioAnalyser.peak)) {
                    this.dir = randomBool() ? -1 : 1;
                }
            }
            if (!params.velocity || shapeSpeed.prc === 0) {
                params.velocity = randomFloat(2, 3, 3);
            }

            let dir = (gridPosition.y % 2 ? -1 : 1);
            dir = (this.layer.settings.pattern_limit ? 1 : dir) * this.dir;
            let step = this.animation.diffPrc * dir * params.velocity * layer.resolution('relative').x;
            step *= this.settings.pattern_paddingx;
            shape.sceneObject().translateX(step);

            let shapeSize = layer.shapeSize(shape.size());
            if (dir < 0 && shape.position().x < -shapeSize) {
                shape.position().x = layer.resolution().x + shapeSize;
            } else if (dir > 0 && shape.position().x > layer.resolution().x + shapeSize) {
                shape.position().x = -shapeSize;
            }
        }
    }
}
