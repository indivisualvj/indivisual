/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapePairingPlugin} from "../ShapePairingPlugin";

class chess extends ShapePairingPlugin
{
    apply(shape) {
        let layer = this.layer;
        if (shape.index % 2 === 1) {
            let src = layer.getShape(shape.index - 1);
            shape.position().copy(src.position());
        }
    }
}

export {chess}