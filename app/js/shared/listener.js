/**
 * @author indivisualvj / https://github.com/indivisualvj
 */


(function () {
    /**
     *
     * @constructor
     */
    HC.Listener = function () {
        this.events = {};
    };

    /**
     *
     * @type {{register: Function, fire: Function}}
     */
    HC.Listener.prototype = {

        /**
         *
         * @param event
         * @param id
         * @param callback
         */
        register: function (event, id, callback) {

            var _func = function (target) {
                if (callback) {
                    callback(target);
                }
            };
            if (!(event in this.events)) {
                this.events[event] = {};
            }
            this.events[event][id] = _func;
        },

        /**
         *
         * @param event
         * @param id
         * @param target
         */
        fire: function (event, id, target) {
            if (event in this.events && id in this.events[event]) {
                var _call = this.events[event][id];
                if (_call) {
                    //console.log(event + '.' + id);
                    _call(target);
                }
            }
        },

        /**
         *
         * @param event
         * @param target
         */
        fireAll: function (event, target) {
            if (event in this.events) {
                for (id in this.events[event]) {
                    var _call = this.events[event][id];
                    if (_call) {
                        //console.log(event + '.' + id);
                        _call(target);
                    }
                }
            }
        }
    }
})();
