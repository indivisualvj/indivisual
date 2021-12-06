/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {DisplayVisibilityPlugin} from "../../shared/DisplayVisibilityPlugin";

class Random extends DisplayVisibilityPlugin {

    static name = 'random';

    visible = {};

    doFirstItemStuff() {
        let speed = this.getSpeed();
        if (speed.starting()) {
            this.visible = {};
            let count = randomInt(1, this.displayManager.displayMap.length);
            for (let i = 0; i < count; i++) {
                let index = randomInt(0, count);
                let display = this.getDisplay(index);
                if (display) {
                    this.visible[display.index] = {
                    };
                }
            }
        }
    }

    apply (display) {
        display.visible = display.index in this.visible;
    }
}

export {Random}
