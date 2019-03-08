/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {

    /**
     *
     * @param settings {HC.Settings}
     * @param layers {[]}
     * @constructor
     */
    HC.SettingsManager = function (settings, layers) {
        this.settings = settings;
        this.layers = layers;
    };

    /**
     *
     * @type {{reset: Function, update: Function, get: Function}}
     */
    HC.SettingsManager.prototype = {

        /**
         *
         */
        reset: function (heap) {

            this.settings.reset();

            for (var layer in this.layers) {

                if (heap && heap.length > 0) {
                    if (heap.indexOf(parseInt(layer)) < 0) {
                        continue;
                    }
                }

                this.layers[layer].settings.reset();
                if (this.layers[layer]._current) {
                    this.layers[layer]._current = false;
                }
            }
        },

        /**
         *
         * @param layer
         * @param key
         * @param value
         * @returns {*}
         */
        update: function (layer, key, value) {

            var l = this.get(layer);

            var v = l.settings.update(key, value);

            if (this.settings) {
                v = this.settings.update(key, value);
            }
            return v;
        },

        /**
         *
         * @param layer
         * @returns {*}
         */
        get: function (layer) {
            while (!layer in this.layers) {
                this.layers.push({});
            }

            if (!this.layers[layer]) {
                this.layers[layer] = {}
            }

            if (!this.layers[layer].settings) {
                var d = this.settings.defaults();
                this.layers[layer].settings = d;
            }

            return this.layers[layer];
        }
    };
})();


(function () {

    /**
     *
     * @param values {{}}
     * @constructor
     */
    HC.Settings = function (values) {

        this.init(values);
    };

    HC.Settings.prototype = {

        /**
         *
         * @param values
         */
        init: function (values) {
            this.isdefault = null;
            this.initial = this.copy(values);

            for (var key in values) {
                this[key] = values[key];
            }
        },

        /**
         *
         * @param key
         * @param value
         * @returns {*}
         */
        update: function (key, value) {
            this.isdefault = null;

            var isFunc = typeof value == 'function' || typeof this[key] == 'function';

            if (key in this && isFunc) {
                // do nothing
                return value;

            } else if (value && typeof value == 'object') {

                if (key) {
                    if (key in this) {
                        this.merge(this[key], value, this.initial[key]);

                    } else {
                        this[key] = this.copy(value);
                    }

                } else {
                    this.merge(this, value, this.initial);
                }

            } else if (key) {
                this[key] = this.validate(key, value);
            }

            return key ? this[key] : this;
        },

        /**
         *
         * @param target
         * @param source
         * @param initial
         */
        merge: function (target, source, initial) {

            if (target) {
                for (var k in source) {
                    var value = source[k];

                    if (k in this && typeof this[k] == 'function') {
                        // do nothing

                    } else if (value && typeof value == 'object') {

                        if (!k in target) {
                            target[k] = this.copy(source);

                        } else {
                            this.merge(target[k], source[k], initial[k]);
                        }

                    } else {
                        target[k] = this.validate(k, source[k], initial);
                    }
                }
            }
        },

        /**
         *
         * @returns {*}
         */
        prepare: function () {

            var data = this.copy(this);

            delete data.isdefault;
            delete data.initial;
            delete data.reset;
            delete data.layers;
            delete data.settings;
            delete data.monitor;

            return data;
        },

        /**
         *
         * @param target
         * @param source
         */
        clean: function (target, source) {

            delete target.isdefault;
            delete target.initial;
            delete target._type;
            delete target.addons;

            for (var k in target) {
                var v = target[k];

                if (!(k in source)) {
                    delete target[k];

                } else if (typeof v == 'object') { // fixme also cleanses tutorial but has to be {} initially hugh!?
                    this.clean(v, source[k]);

                } else {
                    // do nothing
                }
            }

        },

        reset: function () {

            this.update(false, this.initial);

        },

        /**
         *
         * @param data
         * @returns {any}
         */
        copy: function (data) {
            return JSON.parse(JSON.stringify(data));
        },

        /**
         *
         * @param item
         * @returns {boolean}
         */
        contains: function (item) {
            if (!this.initial || !(item in this.initial)) {
                return false;
            }

            return true;
        },

        /**
         *
         * @param item
         * @param value
         * @param initial
         * @returns {*}
         */
        validate: function (item, value, initial) {

            var type = typeof value;
            // check if string contains float and then convert
            if (type == 'string') {
                var f = parseFloat(value);
                if (f && f.toString().length == value.length) {
                    value = f;
                }
            }

            // avoid values to be overwritten by wrong type
            if (initial && item in initial) {
                var org = initial[item];
                var otype = typeof org;

                if (otype !== type) {
                    console.log(item, type, value, otype, org);
                    value = org;
                }
            }

            return value;
        },

        /**
         *
         * @returns {null|*}
         */
        isDefault: function () {
            if (this.isdefault === null) {
                var prpd = JSON.stringify(this.prepare());
                var init = JSON.stringify(this.defaults().prepare());

                this.isdefault = prpd === init;
            }

            return this.isdefault;
        },

        /**
         *
         * @returns {HC.Settings}
         */
        defaults: function () {
            return new HC.Settings(this.copy(this.initial));
        }
    }

})();