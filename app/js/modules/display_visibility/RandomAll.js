/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class RandomAll extends DisplayVisibilityPlugin  {

    static index = 999;
    static name = 'random all';

    current = 0;
    modes = {};
    modeCount = 0;
    modeKeys = [];
    currentMode = 0;

    init() {
        for (let k in HC.Display.display_visibility) {
            let plugin = HC.Display.display_visibility[k]
            if (plugin.constructor.name !== this.constructor.name) {
                this.modeKeys[this.modeCount++] = k;
                this.modes[k] = HC.Display.display_visibility[k];
            }
        }
    }

    doFirstItemStuff() {
        if (this.getSpeed().starting() && randomBool(4)) {
            this.currentMode = randomInt(0, this.modeCount-1);
        }
        HC.Display.display_visibility[this.modeKeys[this.currentMode]].doFirstItemStuff();
    }

    apply (display) {
        HC.Display.display_visibility[this.modeKeys[this.currentMode]].apply(display);
    }
}

export {RandomAll}
