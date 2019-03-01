{
    HC.plugins.rotation_direction.chess = class Plugin extends HC.RotationDirectionPlugin {
        static name = 'chess';

        apply(shape) {
            if (this.isFirstShape(shape)) {
                this.switcher = !this.switcher;
            }

            var params = this.params(shape);
            var mod = this.switcher ? 0 : 1;

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
            var layer = this.layer;
            if (this.isFirstShape(shape)) {
                this.switcher = !this.switcher;
            }
            var grid = layer.getPatternPlugin('matrix').gridPosition(shape);
            var params = this.params(shape);
            var mod = this.switcher ? 0 : 1;

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
            var layer = this.layer;
            if (this.isFirstShape(shape)) {
                this.switcher = !this.switcher;
            }
            var grid = layer.getPatternPlugin('matrix').gridPosition(shape);
            var params = this.params(shape);
            var mod = this.switcher ? 0 : 1;

            if (grid.y % 2 == mod) {
                params.dir = 1;

            } else {
                params.dir = -1;
            }
        }
    }
}