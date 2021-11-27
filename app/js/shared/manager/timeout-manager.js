/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.TimeoutManager = class TimeoutManager {

        static timeouts = [];

        static add(key, timeout, fn) {
            this.remove(key);
            let _fn = () => {
                this.delete(key);
                requestAnimationFrame(() => {
                    // console.log('executing', key);
                    fn();
                });
            };
            if (timeout) {
                // console.log('setting', key);
                this.timeouts[key] = setTimeout(_fn, timeout);
            } else {
                fn();
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

        static remove(key) {
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
                this.remove(key);
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
}