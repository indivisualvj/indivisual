/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.controls = HC.controls || {};

{
    /**
     *
     * @type {HC.ControlSet}
     */
    HC.ControlSet = class ControlSet {

        /**
         *
         */
        _name;

        /**
         *
         */
        _className;

        /**
         *
         * @type {{}}
         */
        parents = {};

        /**
         *
         * @type {boolean}
         */
        visible = true;

        /**
         *
         * @type {boolean}
         */
        open = false;

        /**
         * definition of all available settings
         * @type {Object.<string, *>}
         */
        settings;

        /**
         * actual settings
         * @type {Object.<string, *>}
         */
        properties;

        /**
         * control and data types
         */
        types;

        /**
         *
         * @type {{}}
         */
        styles = {};

        /**
         *
         * @type {Object.<string, *>}
         */
        values = {};

        /**
         *
         * @type {Object.<string, HC.Event>}
         */
        events = {};

        /**
         *
         * @type {Object.<string, Function>}
         */
        hooks = {};

        /**
         *
         * @type {Object.<string, Object.<string, string>>}
         */
        attributes = {}

        /**
         * @type {HC.Config}
         */
        config;

        /**
         *
         * @param name
         * @param {HC.Config} config
         */
        constructor(name, config) {
            this._className = name;
            this.config = config;

            if (!this.constructor._name) {
                this._name = name;
            } else {
                this._name = this.constructor._name;
            }
        }

        /**
         *
         * @param pluggedValues
         */
        init(pluggedValues) {
            if (!this.properties) {
                this.properties = this.defaults();
            }

            if (pluggedValues) {
                for (let key in this.settings) {
                    if (key.endsWith('_oscillate')) {
                        this.values[key] = pluggedValues.oscillate;

                    } else if (key in pluggedValues) {
                        this.values[key] = pluggedValues[key];
                    }
                }
            }
        }

        /**
         *
         * @returns {string}
         */
        name() {
            return this._name;
        }

        /**
         *
         * @return {string}
         */
        className() {
            return this._className;
        }

        /**
         *
         */
        reset() {
            this.setAll(this.defaults());
        }

        /**
         * @type {Object.<string, Object.<string, *>>}
         */
        prepare() {
            let data = {};
            data[this.className()] = this.properties;
            return data;
        }

        /**
         *
         * @returns Object
         */
        defaults() {
            return clone(this.settings);
        }

        /**
         *
         * @returns {boolean}
         */
        isDefault() {
            for (let key in this.settings) {

                if (key in this.types) {
                    if (this.types[key].includes('hidden')) {
                        return true;
                    }
                }

                let set = this.settings[key];
                let prop = this.properties[key];

                let st = typeof set;
                let sp = typeof prop;

                if (st === 'object' && sp === 'object') {
                    // compare by json
                    if (JSON.stringify(set) !== JSON.stringify(prop)) {
                        // console.log('no default', set, prop);
                        return false;
                    }

                } else if (set != prop) { // yeah but keep it alone! !== does not work ;)
                    // console.log('no default', set, prop);
                    return false;
                }
            }
            return true;
        }

        /**
         *
         * @param key
         * @returns {null|Object}
         */
        get(key) {
            if (key in this.settings) {
                return this.properties[key];
            }
            key = this._key(key);
            if (key in this.settings) {
                return this.properties[key];
            }

            return null;
        }

        /**
         *
         * @param key
         * @returns {null|Object}
         */
        getDefault(key) {
            if (key in this.settings) {
                return this.settings[key];
            }

            return null;
        }

        /**
         *
         * @param key
         * @param value
         * @param context
         * @returns {*}
         */
        set(key, value, context) {
            if (key in this.settings) {
                let oldValue = this.properties[key];

                if ('onBeforeSet' in this.hooks) {
                    value = this.hooks.onBeforeSet(key, value, context, this);
                }

                this.properties[key] = this.validate(key, value)

                if ('onChange' in this.hooks && oldValue !== this.properties[key]) {
                    this.hooks.onChange(key, value, context, this);
                }
            }

            return this.properties[key];
        }

        /**
         *
         * @param data
         */
        setAll(data) {
            for (let k in data) {
                this.set(k, data[k]);
            }
        }

        /**
         *
         * @param key
         * @param value
         * @returns {number}
         */
        validate(key, value) {
            // avoid values to be overwritten by wrong type
            if (key in this.properties) {
                let org = this.properties[key];
                let otype = typeof org;
                let type = typeof value;

                if (otype !== type) {
                    // cast to whatever
                    if (type === 'string' && otype !== 'string') {
                        value = HC.parse(value, otype);

                        // cast to string
                    } else if (type !== 'string' && otype === 'string') {
                        value = value.toString();

                        // fallback to original
                    } else {

                        value = org;
                    }
                }
            }

            return value;
        }

        /**
         * This is here for migrating settings from e.g. lighting_lookat_[property] to lookat_[property]
         * @param key
         * @returns {void | string | never}
         * @private
         */
        _key(key) {
            return key.replace(this.name() + '_', '');
        }

        /**
         *
         * @returns {string}
         */
        toJSON() {
            return JSON.stringify(this.properties, null, 4)
        }

        /**
         *
         * @param json
         */
        fromJSON(json) {
            let data = JSON.parse(json);

            for (let k in this.settings) {
                if (k in data) {
                    this.set(k, data[k]);
                }
            }
        }
    }
}

{
    /**
     *
     * @type {HC.IterableControlSet}
     */
    HC.IterableControlSet = class IterableControlSet extends HC.ControlSet {

        prefix = '';

        prefixes = {};

        members = {settings: null, types: null, styles: null, values: null, parents: null};

        /**
         *
         * @param {HC.Config} pluggedValues
         */
        init(pluggedValues) {
            this.initMembers();
            this.createSettings(pluggedValues);
            super.init(pluggedValues);
        }

        /**
         *
         */
        initMembers() {
            for (let member in this.members) {
                this.members[member] = {...this[member]}; // clone by spread (ES6)
            }
        }

        /**
         *
         * @param pluggedValues
         */
        createSettings(pluggedValues) {
            for (let member in this.members) {
                let settings = this.members[member];
                this[member] = {};
                for (let i = 0; i < pluggedValues[this.prefix].length; i++) {
                    this._create(member, i, settings);
                }
            }
        }

        /**
         *
         * @param member
         * @param i
         * @param settings
         * @param value
         * @protected
         */
        _create(member, i, settings, value) {
            let prefix = ((member in this.prefixes) ? this.prefixes[member] : this.prefix);
            let regex = new RegExp('^' + prefix);

            for (let k in settings) {
                let key = k.replace(regex, prefix + i);
                this[member][key] = (value !== undefined) ? value : settings[k];

                // console.log(member, k, key, v);
            }
        }
    }
}
