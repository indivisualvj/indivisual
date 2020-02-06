/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Listener}
     */
    HC.Listener = class Listener {
        events = {};

        /**
         *
         * @param event
         * @param id
         * @param callback
         */
        register(event, id, callback) {

            let _func = function (target) {
                if (callback) {
                    callback(target);
                }
            };
            if (!(event in this.events)) {
                this.events[event] = {};
            }
            this.events[event][id] = _func;
        }

        /**
         *
         * @param event
         * @param id
         */
        remove(event, id) {
            if (event in this.events) {
                if (id && id in this.events[event]) {
                    delete this.events[event][id];

                }
            }
        }

        /**
         *
         * @param event
         */
        removeEvent(event) {
            if (event in this.events) {
                delete this.events[event];
            }
        }

        /**
         *
         * @param id
         */
        removeId(id) {
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
         * @param event
         * @param id
         */
        removeEventId(event, id) {
            if (event in this.events && id in this.events[event]) {
                delete this.events[event][id];
            }
        }

        /**
         *
         * @param prefix
         */
        removeLike(prefix) {
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
        reset() {
            this.events = {};
        }

        /**
         *
         * @param event
         * @param id
         * @param target
         */
        fireEventId(event, id, target) {
            if (event in this.events && id in this.events[event]) {
                this.bruteFireEventId(event, id, target);

            } else {
                console.warn('unknown event', event, id);
            }
        }

        /**
         *
         * @param event
         * @param id
         * @param target
         */
        bruteFireEventId(event, id, target) {
            let _call = this.events[event][id];
            if (_call) {
                _call(target);
            }
        }

        /**
         *
         * @param event
         * @param target
         */
        fireEvent(event, target) {
            if (event in this.events) {
                for (let id in this.events[event]) {
                    this.bruteFireEventId(event, id, target);
                }
            }
        }
    }
}
