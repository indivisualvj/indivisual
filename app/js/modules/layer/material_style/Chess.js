/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MaterialStylePlugin} from "../MaterialStylePlugin";

class fillorstroke extends MaterialStylePlugin {
    static name = 'chess (fill | stroke)';

    apply(shape) {
        let params = this.params(shape);
        params.stroke = (shape.index % 2 ? true : false);
    }
}


class strokeorfill extends MaterialStylePlugin {
    static name = 'chess (stroke | fill)';

    apply(shape) {
        let params = this.params(shape);
        params.stroke = (shape.index % 2) ? false : true;
    }
}

export {fillorstroke, strokeorfill};
