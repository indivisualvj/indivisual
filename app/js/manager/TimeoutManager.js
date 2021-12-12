/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class TimeoutManager {

    static timeouts = [];

    /**
     *
     * @param key
     * @param timeout
     * @param fn
     * @param onError
     */
    static add(key, timeout, fn, onError) {
        this.stop(key);
        let _fn = () => {
            this.delete(key);
            requestAnimationFrame(() => {
                try {
                    fn();
                } catch (e) {
                    if (onError) {
                        onError(e);
                    } else {
                        throw e;
                    }
                }
            });
        };
        if (timeout) {
            this.timeouts[key] = setTimeout(_fn, timeout);
        } else {
            _fn();
        }
    }

    static get(key) {
        if (this.has(key)) {
            return this.timeouts[key];
        }

        throw new Error('timeout "' + key + '" not found');
    }

    static has(key) {
        return this.timeouts.hasOwnProperty(key);
    }

    static stop(key) {
        if (this.has(key)) {
            // console.log('clearing', key);
            clearTimeout(this.get(key));
            this.delete(key);
        }
    }

    static delete(key) {
        if (this.has(key)) {
            delete this.timeouts[key];
        }
    }

    static removeAll() {
        for (const key in this.timeouts) {
            this.stop(key);
        }
    }

    static chainExecuteCalls(calls, callback) {
        let _load = function (index) {
            if (index >= calls.length) {
                if (callback) {
                    callback();
                }
                return;
            }
            let _call = calls[index];
            _call(/*_synced = */function () {
                _load(index + 1);
            });
        };

        _load(0);
    }
}

export {TimeoutManager}