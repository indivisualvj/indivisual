/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {DisplayVisibilityPlugin} from "../../shared/DisplayVisibilityPlugin";

class StackOneOff extends DisplayVisibilityPlugin {

    static name = 'stack one off';
    current = 0;

    doFirstItemStuff() {
        let speed = this.getSpeed();

        if (speed.starting()) {
            this.current++;

            if (this.current >= this.displayManager.displayMap.length) {
                this.current = 0;
            }
        }
    }

    apply (display) {
        display.visible = display.index !== this.getDisplay(this.current).index;
    }
}

export {StackOneOff}

class StackOneOffReversed extends StackOneOff {

    static name = 'stack one off reversed';

    doFirstItemStuff() {
        let speed = this.getSpeed();
        if (speed.starting()) {
            this.current--;

            if (this.current < 0) {
                this.current = this.displayManager.displayMap.length-1;
            }
        }
    }
}

export {StackOneOffReversed}

class StackOneOn extends StackOneOff {

    static name = 'stack one on';

    apply (display) {
        display.visible = display.index === this.getDisplay(this.current).index;
    }
}

export {StackOneOn}

class StackOneOnReversed extends StackOneOffReversed {

    static name = 'stack one on reversed';

    apply (display) {
        display.visible = display.index === this.getDisplay(this.current).index;
    }
}

export {StackOneOnReversed}

class RandomOneOff extends StackOneOff {

    static name = 'random one off';

    doFirstItemStuff() {
        let speed = this.getSpeed();
        if (speed.starting()) {
            this.current = randomInt(0, this.displayManager.displayMap.length-1);
        }
    }
}

export {RandomOneOff}

class RandomOneOn extends StackOneOn {

    static name = 'random one on';

    doFirstItemStuff() {
        let speed = this.getSpeed();
        if (speed.starting()) {
            this.current = randomInt(0, this.displayManager.displayMap.length-1);
        }
    }
}

export {RandomOneOn}
