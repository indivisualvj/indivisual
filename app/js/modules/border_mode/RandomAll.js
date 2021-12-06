/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {BorderModePlugin} from "../../shared/BorderModePlugin";

class RandomAll extends BorderModePlugin
{
    static index = 999;
    static name = 'random all';

    current = 0;
    modes = {};
    modeCount = 0;
    modeKeys = [];
    currentMode = 0;

    init(plugins) {
        super.init(plugins);
        for (let k in plugins) {
            let plugin = plugins[k]
            if (plugin.constructor.name !== this.constructor.name) {
                this.modeKeys[this.modeCount++] = k;
                this.modes[k] = plugins[k];
            }
        }
    }

    apply (ctx, points, pc, speed, prc) {
        if (speed.starting()) {
            this.currentMode = randomInt(0, this.modeCount-1);
        }
        BorderModePlugin.plugins[this.modeKeys[this.currentMode]].apply(ctx, points, pc, speed, prc);
    }
}

export {RandomAll}