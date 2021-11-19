/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.TimeoutManager = class TimeoutManager {

        timeouts = [];

        add(key, timeout, fn) {
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

        get(key) {
            if (this.has(key)) {
                return this.timeouts[key];
            }

            throw new Error('timeout "' + key + '" not found');
        }

        has(key) {
            return this.timeouts.hasOwnProperty(key);
        }

        remove(key) {
            if (this.has(key)) {
                // console.log('clearing', key);
                clearTimeout(this.get(key));
                this.delete(key);
            }
        }

        delete(key) {
            if (this.has(key)) {
                delete this.timeouts[key];
            }
        }

        removeAll() {
            for (const key in this.timeouts) {
                this.remove(key);
            }
        }

        static _tm = new this();
        static getInstance() {
            return this._tm;
        }
    }
}