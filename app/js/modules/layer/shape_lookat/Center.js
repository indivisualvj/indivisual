/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeLookatPlugin} from "../ShapeLookatPlugin";
import {Vector2} from "three";

class center extends ShapeLookatPlugin {
    static index = 2;

    apply(shape) {
        let vector = this.centerVector();
        shape.lookAt(vector);
    }
}


class forcecenter extends ShapeLookatPlugin {
    static index = 2;

    apply(shape) {
        let vector = this.centerVector();
        shape.forceLookAt(vector);
    }
}


class centerz extends ShapeLookatPlugin {
    static name = 'center z-axis';
    static index = 3;

    apply(shape) {
        let x = shape.x();
        let y = shape.y();
        let vec = new Vector2(x, y);
        let cvec = this.centerVector().add(this.layer.resolution('half'));

        x = vec.x - cvec.x;
        y = vec.y - cvec.y;
        let angle = Math.atan2(y, x);
        shape.sceneObject().rotation.set(0, 0, -angle);
        shape.rotationZ(0);
    }
}

export {center, centerz, forcecenter};
