/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {RotationDirectionPlugin} from "../RotationDirectionPlugin";

class chess extends RotationDirectionPlugin {
    static name = 'chess';

    apply(shape) {
        if (this.isFirstShape(shape)) {
            this.switcher = !this.switcher;
        }

        let params = this.params(shape);
        let mod = this.switcher ? 0 : 1;

        if (shape.index % 2 === mod) {
            params.dir = 1;

        } else {
            params.dir = -1;
        }
    }
}

class chesscolumns extends RotationDirectionPlugin {
    static name = 'chess columns';

    apply(shape) {
        let layer = this.layer;
        if (this.isFirstShape(shape)) {
            this.switcher = !this.switcher;
        }
        let grid = layer.getPatternPlugin('matrix').gridPosition(shape);
        let params = this.params(shape);
        let mod = this.switcher ? 0 : 1;

        if (grid.x % 2 === mod) {
            params.dir = 1;

        } else {
            params.dir = -1;
        }
    }
}

class chessrows extends RotationDirectionPlugin {
    static name = 'chess rows';

    apply(shape) {
        let layer = this.layer;
        if (this.isFirstShape(shape)) {
            this.switcher = !this.switcher;
        }
        let grid = layer.getPatternPlugin('matrix').gridPosition(shape);
        let params = this.params(shape);
        let mod = this.switcher ? 0 : 1;

        if (grid.y % 2 === mod) {
            params.dir = 1;

        } else {
            params.dir = -1;
        }
    }
}

export {chess, chessrows, chesscolumns};
