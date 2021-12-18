/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {DisplayVisibilityPlugin} from "../DisplayVisibilityPlugin";

class RandomFlash extends DisplayVisibilityPlugin {

    static name = 'random flash';

    flashing = {};

    timeoutInFrames(speed) {
        let timeout = speed.duration / 2;
        return Math.round((timeout / this.displayManager.animation.duration) / 2);
    }

    doFirstItemStuff() {
        let speed = this.getSpeed();
        if (speed.starting()) {
            this.flashing = {};
            let count = randomInt(1, this.displayManager.displayMap.length);
            for (let i = 0; i < count; i++) {
                let index = randomInt(0, count);
                let display = this.getDisplay(index);
                if (display) {
                    this.flashing[display.index] = {
                        frames: this.timeoutInFrames(this.getSpeed())
                    };
                }
            }
        }
    }

    apply(display) {
        if (display.index in this.flashing) {
            let props = this.flashing[display.index];
            display.visible = props.frames > 0;
            props.frames--;

        } else {
            display.visible = false;
        }
    }
}

export {RandomFlash}

class RandomBlitz extends RandomFlash {

    static name = 'random blitz';

    doFirstItemStuff() {
        let speed = this.getSpeed();
        if (speed.starting()) {
            this.flashing = {};
            let count = randomInt(1, this.displayManager.displayMap.length);
            for (let i = 0; i < count; i++) {
                let index = randomInt(0, count);
                let display = this.getDisplay(index);
                if (display) {
                    this.flashing[display.index] = {
                        frames: this.timeoutInFrames(this.displayManager.beatKeeper.getSpeed('sixteen'))
                    };
                }
            }
        }
    }

    apply(display) {
        if (display.index in this.flashing) {
            let props = this.flashing[display.index];
            display.blitz = props.frames;
            props.frames--;

        } else {
            display.blitz = false;
        }
    }
}

export {RandomBlitz}

class RandomSmear extends RandomFlash {

    static name = 'random smear';

    apply(display) {
        if (display.index in this.flashing) {
            let props = this.flashing[display.index];
            display.smear = props.frames > 0;
            props.frames--;

        } else {
            display.smear = false;
        }
    }
}

export {RandomSmear}