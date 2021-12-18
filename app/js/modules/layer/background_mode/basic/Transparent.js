/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {BackgroundModePlugin} from "../BackgroundModePlugin";

class transparent extends BackgroundModePlugin {
    static index = 1;

    apply() {
        if (this.needsUpdate()) {
            this.layer.setBackground(this.current(this.id()));
        }
    }
}

export {transparent};
