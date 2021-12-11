/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {RotationOffsetModePlugin} from "../RotationOffsetModePlugin";

class chess45lr extends RotationOffsetModePlugin {
    static name = 'chess45lr';

    apply(shape) {
        let a = 45;
        if (shape.index % 2 === 0) {
        } else {
            a *= -1;
        }

        let x = a * this.settings.rotation_offsetx;
        let y = a * this.settings.rotation_offsety;
        let z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
}


class chess90lr extends RotationOffsetModePlugin {
    static name = 'chess90lr';

    apply(shape) {
        let a = 90;
        if (shape.index % 2 === 0) {
        } else {
            a *= -1;
        }

        let x = a * this.settings.rotation_offsetx;
        let y = a * this.settings.rotation_offsety;
        let z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
}


class chessrowslr extends RotationOffsetModePlugin {
    static name = 'chessrowslr';

    apply(shape) {
        let layer = this.layer;

        let a = 90;
        let gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
        if (gridPosition.y % 2 === 0) {
        } else {
            a *= -1;
        }

        let x = a * this.settings.rotation_offsetx;
        let y = a * this.settings.rotation_offsety;
        let z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
}


class chesscolumnslr extends RotationOffsetModePlugin {
    static name = 'chesscolumnslr';

    apply(shape) {
        let layer = this.layer;
        let gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
        let a = 90;
        if (gridPosition.x % 2 === 0) {
        } else {
            a *= -1;
        }

        let x = a * this.settings.rotation_offsetx;
        let y = a * this.settings.rotation_offsety;
        let z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
}

export {chesscolumnslr, chessrowslr, chess45lr, chess90lr};
