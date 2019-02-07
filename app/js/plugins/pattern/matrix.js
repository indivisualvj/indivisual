HC.plugins.pattern.matrix = _class(
    function () {
        this.columns = false;
        this.rows = false;
    }, HC.PatternPlugin, {
        name: 'matrix',
        index: 2,
        injections: {position: false},
        apply: function (shape) {
            var layer = this.layer;

            var gridPosition = this.gridPosition(shape);

            var gapx = layer.shapeSize(1) * this.settings.pattern_paddingx;
            var gapy = layer.shapeSize(1) * this.settings.pattern_paddingy;

            gapx *= this.settings.pattern_padding;
            gapy *= this.settings.pattern_padding;

            var ox = (-gapx * this.columnCount(layer)) / 2;
            var oy = (-gapy * this.rowCount(layer)) / 2;

            var x = ox + gridPosition.x * gapx - gapx / 2;
            var y = oy + gridPosition.y * gapy - gapy / 2;
            var z = 0;

            layer.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        },

        getDistributionOnMatrix: function (columns, rows, index, vector) {
            // find out the number of filled rows
            var row = Math.floor(index / columns);

            // find out the column index
            var column = index - row * columns;
            // revert column index on every odd row
            if (row % 2 == 1) {
                column = columns - column - 1;
            }
            vector.x = ++column;
            vector.y = ++row;
        },

        gridPosition: function (shape) {
            var layer = this.layer;
            var params = this.params(shape);

            if (params.position === false) {
                params.position = new THREE.Vector2();
                this.getDistributionOnMatrix(this.columnCount(), this.rowCount(), shape.index, params.position);
            }

            return params.position;
        },

        columnCount: function () {
            var layer = this.layer;
            if (this.columns === false) {
                this.columns = Math.floor(layer.width / layer.shapeSize(1));
            }
            return this.columns;
        },

        rowCount: function () {
            var layer = this.layer;
            if (this.rows === false) {
                this.rows = Math.ceil(layer.shapeCount() / this.columnCount(layer));
            }

            return this.rows;
        }
    }
);