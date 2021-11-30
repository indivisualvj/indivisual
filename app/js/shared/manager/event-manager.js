/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.EventManager = class EventManager {
        static events = {};
        /**
         * (re)registers a event. no event can exist twice.
         * @param event
         * @param id
         * @param callback
         */
        static register(event, id, callback) {
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
        static remove(event, id) {
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
        static removeEvent(event) {
            if (event in this.events) {
                delete this.events[event];
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
         * @param event
         * @param id
         */
        static removeEventId(event, id) {
            if (event in this.events && id in this.events[event]) {
                delete this.events[event][id];
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
         * @param event
         * @param emitter
         */
        static fireEvent(event, emitter) {
            if (event in this.events) {
                for (let id in this.events[event]) {
                    this._doFireEvent(event, id, emitter);
                }
            }
        }

        /**
         *
         * @param event
         * @param id
         * @param emitter
         * @param timeout
         */
        static fireEventId(event, id, emitter, timeout) {
            if (event in this.events && id in this.events[event]) {
                if (timeout) {
                    HC.TimeoutManager.add(event + '.' + id, timeout, () => {
                        this._doFireEvent(event, id, emitter);
                    });

                } else {
                    this._doFireEvent(event, id, emitter);
                }

            } else {
                // console.warn('unknown event', event, id);
            }
        }

        /**
         *
         * @param event
         * @param id
         * @param emitter
         * @private
         */
        static _doFireEvent(event, id, emitter) {
            let _call = this.events[event][id];
            if (_call) {
                _call(emitter);
            }
        }
    }
}
