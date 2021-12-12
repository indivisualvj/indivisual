/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {DisplayVisibilityPlugin} from "../DisplayVisibilityPlugin";

class RandomAll extends DisplayVisibilityPlugin  {

    static index = 999;
    static name = 'random all';
    static plugins;

    current = 0;
    modes = {};
    modeCount = 0;
    modeKeys = [];
    currentMode = 0;

    init(plugins) {
        RandomAll.plugins = plugins;

        for (let k in plugins) {
            let plugin = plugins[k]
            if (plugin.constructor.name !== this.constructor.name) {
                this.modeKeys[this.modeCount++] = k;
                this.modes[k] = plugins[k];
            }
        }
    }

    doFirstItemStuff() {
        if (this.getSpeed().starting() && randomBool(4)) {
            this.currentMode = randomInt(0, this.modeCount-1);
        }
        RandomAll.plugins[this.modeKeys[this.currentMode]].doFirstItemStuff();
    }

    apply (display) {
        RandomAll.plugins[this.modeKeys[this.currentMode]].apply(display);
    }
}

export {RandomAll}
