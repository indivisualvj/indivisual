/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {TimeoutManager} from "./TimeoutManager";

class EventManager {

    static events = {};

    /**
     * (re)registers an event. no event with the given key and id can exist twice.
     * @param key
     * @param id
     * @param callback
     */
    static register(key, id, callback) {
        let _func = function (target) {
            if (callback) {
                callback(target);
            }
        };
        if (!(key in this.events)) {
            this.events[key] = {};
        }
        this.events[key][id] = _func;
    }

    /**
     *
     * @param key
     * @param id
     */
    static remove(key, id) {
        if (key in this.events) {
            if (id && id in this.events[key]) {
                delete this.events[key][id];

            }
        }
    }

    /**
     *
     * @param key
     */
    static removeEvent(key) {
        if (key in this.events) {
            delete this.events[key];
        }
    }

    /**
     *
     * @param id
     */
    static removeId(id) {
        for (let e in this.events) {
            let event = this.events[e];

            for (let i in event) {
                if (i === id) {
                    delete event[i];
                }
            }
        }
    }

    /**
     *
     * @param key
     * @param id
     */
    static removeEventId(key, id) {
        if (key in this.events && id in this.events[key]) {
            delete this.events[key][id];
        }
    }

    /**
     *
     * @param prefix
     */
    static removeLike(prefix) {
        for (let e in this.events) {
            let event = this.events[e];

            for (let i in event) {
                let regx = new RegExp('^' + prefix + '');
                if (i.match(regx)) {
                    delete event[i];
                }
            }
        }
    }

    /**
     *
     */
    static reset() {
        this.events = {};
    }

    /**
     *
     * @param key
     * @param emitter
     */
    static fireEvent(key, emitter) {
        if (key in this.events) {
            for (let id in this.events[key]) {
                this._doFireEvent(key, id, emitter);
            }
        }
    }

    /**
     *
     * @param key
     * @param id
     * @param emitter
     * @param timeout
     */
    static fireEventId(key, id, emitter, timeout) {
        if (key in this.events && id in this.events[key]) {
            if (timeout) {
                TimeoutManager.add(key + '.' + id, timeout, () => {
                    this._doFireEvent(key, id, emitter);
                });

            } else {
                this._doFireEvent(key, id, emitter);
            }

        } else {
            // console.warn('unknown event', event, id);
        }
    }

    /**
     *
     * @param key
     * @param id
     * @param emitter
     * @private
     */
    static _doFireEvent(key, id, emitter) {
        let _call = this.events[key][id];
        if (_call) {
            _call(emitter);
        }
    }
}

export {EventManager}