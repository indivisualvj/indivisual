/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.Display.display_visibility.visible = class visible extends HC.Display.VisibilityModePlugin  {

        static index = 10;

        apply (display) {
            display.visible = true;
            display.blitz = false;
            // display.smear = false;
            display.judder = false;
        }
    }
}

{
    HC.Display.display_visibility.randomall = class randomall extends HC.Display.VisibilityModePlugin  {

        static index = 999;
        // static name = 'random all';

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
}

{
    HC.Display.display_visibility.stackoneoff = class stackoneoff extends HC.Display.VisibilityModePlugin {

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
}

{
    HC.Display.display_visibility.stackoneoffr = class stackoneoffr extends HC.Display.display_visibility.stackoneoff {

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
}

{
    HC.Display.display_visibility.stackoneon = class stackoneon extends HC.Display.display_visibility.stackoneoff {

        static name = 'stack one on';

        apply (display) {
            display.visible = display.index === this.getDisplay(this.current).index;
        }
    }
}

{
    HC.Display.display_visibility.stackoneonr = class stackoneonr extends HC.Display.display_visibility.stackoneoffr {

        static name = 'stack one on reversed';

        apply (display) {
            display.visible = display.index === this.getDisplay(this.current).index;
        }
    }
}

{
    HC.Display.display_visibility.random = class random extends HC.Display.VisibilityModePlugin {

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
}

{
    HC.Display.display_visibility.randomoneoff = class randomoneoff extends HC.Display.display_visibility.stackoneoff {

        static name = 'random one off';

        doFirstItemStuff() {
            let speed = this.getSpeed();
            if (speed.starting()) {
                this.current = randomInt(0, this.displayManager.displayMap.length-1);
            }
        }
    }
}

{
    HC.Display.display_visibility.randomoneon = class randomoneon extends HC.Display.display_visibility.stackoneon {

        static name = 'random one on';

        doFirstItemStuff() {
            let speed = this.getSpeed();
            if (speed.starting()) {
                this.current = randomInt(0, this.displayManager.displayMap.length-1);
            }
        }
    }
}

{
    HC.Display.display_visibility.randomflash = class randomflash extends HC.Display.VisibilityModePlugin {

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

        apply (display) {
            if (display.index in this.flashing) {
                let props = this.flashing[display.index];
                display.visible = props.frames > 0;
                props.frames--;

            } else {
                display.visible = false;
            }
        }
    }
}

{
    HC.Display.display_visibility.randomblitz = class randomblitz extends HC.Display.display_visibility.randomflash  {

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

        apply (display) {
            if (display.index in this.flashing) {
                let props = this.flashing[display.index];
                display.blitz = props.frames;
                props.frames--;

            } else {
                display.blitz = false;
            }
        }
    }
}

{
    HC.Display.display_visibility.randomsmear = class randomsmear extends HC.Display.display_visibility.randomflash  {

        static name = 'random smear';

        apply (display) {
            if (display.index in this.flashing) {
                let props = this.flashing[display.index];
                display.smear = props.frames > 0;
                props.frames--;

            } else {
                display.smear = false;
            }
        }
    }
}
