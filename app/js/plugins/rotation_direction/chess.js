{
    HC.plugins.rotation_direction.chess = class Plugin extends HC.RotationDirectionPlugin {
        static name = 'chess';

        apply(shape) {
            if (this.isFirstShape(shape)) {
                this.switcher = !this.switcher;
            }

            let params = this.params(shape);
            let mod = this.switcher ? 0 : 1;

            if (shape.index % 2 == mod) {
                params.dir = 1;

            } else {
                params.dir = -1;
            }
        }
    }
}
{
    HC.plugins.rotation_direction.chesscolumns = class Plugin extends HC.RotationDirectionPlugin {
        static name = 'chess columns';

        apply(shape) {
            let layer = this.layer;
            if (this.isFirstShape(shape)) {
                this.switcher = !this.switcher;
            }
            let grid = layer.getPatternPlugin('matrix').gridPosition(shape);
            let params = this.params(shape);
            let mod = this.switcher ? 0 : 1;

            if (grid.x % 2 == mod) {
                params.dir = 1;

            } else {
                params.dir = -1;
            }
        }
    }
}
{
    HC.plugins.rotation_direction.chessrows = class Plugin extends HC.RotationDirectionPlugin {
        static name = 'chess rows';

        apply(shape) {
            let layer = this.layer;
            if (this.isFirstShape(shape)) {
                this.switcher = !this.switcher;
            }
            let grid = layer.getPatternPlugin('matrix').gridPosition(shape);
            let params = this.params(shape);
            let mod = this.switcher ? 0 : 1;

            if (grid.y % 2 == mod) {
                params.dir = 1;

            } else {
                params.dir = -1;
            }
        }
    }
}