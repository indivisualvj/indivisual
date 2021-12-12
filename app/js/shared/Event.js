/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import hotkeys from "hotkeys-js";

class Event
{
    /**
     * @type {string}
     */
    type;

    /**
     * @type {function}
     */
    callback;

    /**
     *
     * @param type
     * @param callback
     */
    constructor(type, callback) {
        this.type = type;
        this.callback = callback;
    }

    /**
     *
     * @param element
     */
    register(element) {
        element.addEventListener(this.type, this.callback);
    }
}

class Hotkey extends Event {

    label;

    /**
     *
     * @param type
     * @param callback
     * @param label
     */
    constructor(type, callback, label) {
        super(type, callback);
        this.label = label || type;
    }

    register(element) {
        Hotkey.add(this.type, (e) => {
            e.preventDefault();
            this.callback(e);
        });
    }

    static add() {
        if (hotkeys) {
            hotkeys(...arguments);
        }
    }

    static isPressed() {
        if (hotkeys) {
            return hotkeys.isPressed(...arguments);
        }
    }
}

export {Hotkey, Event};
