HC.plugins.rotation_direction.chess = _class( // 5
    function () {
        this.switcher = false;
    },
    HC.RotationDirectionPlugin, {
        name: 'chess',
        apply(shape) {
            var layer = this.layer;
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
);

HC.plugins.rotation_direction.chesscolumns = _class( // 6
    function () {
        this.switcher = false;
    },
    HC.RotationDirectionPlugin, {
        name: 'chess columns',
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
);

HC.plugins.rotation_direction.chessrows = _class( // 7
    function () {
        this.switcher = false;
    },
    HC.RotationDirectionPlugin, {
        name: 'chess rows',
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
);