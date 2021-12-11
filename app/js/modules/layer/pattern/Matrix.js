/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";

class matrix extends PatternPlugin {
        static name = 'matrix';
        static index = 2;
        columns = false;
        rows = false;
        injections = {position: false};

        apply(shape) {
            let layer = this.layer;

            let gridPosition = this.gridPosition(shape);
            let gapx = layer.shapeSize(1) * this.settings.pattern_paddingx;
            let gapy = layer.shapeSize(1) * this.settings.pattern_paddingy;

            gapx *= this.settings.pattern_padding;
            gapy *= this.settings.pattern_padding;

            let ox = (-gapx * this.columnCount(layer)) / 2;
            let oy = (-gapy * this.rowCount(layer)) / 2;

            let x = ox + gridPosition.x * gapx - gapx / 2;
            let y = oy + gridPosition.y * gapy - gapy / 2;
            let z = 0;

            this.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        }

        getDistributionOnMatrix(columns, rows, index, vector) {
            // find out the number of filled rows
            let row = Math.floor(index / columns);

            // find out the column index
            let column = index - row * columns;
            // revert column index on every odd row
            if (row % 2 === 1) {
                column = columns - column - 1;
            }
            vector.x = ++column;
            vector.y = ++row;
        }

        gridPosition(shape) {
            let params = this.params(shape);

            if (params.position === false) {
                params.position = new THREE.Vector2();
                this.getDistributionOnMatrix(this.columnCount(), this.rowCount(), shape.index, params.position);
            }

            return params.position;
        }

        columnCount() {
            let layer = this.layer;
            if (this.columns === false) {
                this.columns = Math.floor(layer.resolution().x / layer.shapeSize(1));
            }
            return this.columns;
        }

        rowCount() {
            let layer = this.layer;
            if (this.rows === false) {
                this.rows = Math.ceil(layer.shapeCount() / this.columnCount(layer));
            }

            return this.rows;
        }
    }

export {matrix};
