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

        settings;
        properties;

        construct() {
            this.init();
        }

        /**
         *
         * @param reset
         */
        init(reset) {
            if (!this.properties || reset) {
                this.properties = this.defaults();
            }
        }

        /**
         *
         */
        reset() {
            this.init(true);
        }

        /**
         *
         * @returns Object
         */
        defaults() {
            return JSON.parse(JSON.stringify(this.settings, null, 4));
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
         * @returns {null|*}
         */
        getDefault(key) {
            if (key in this.settings) {
                return this.settings[key];
            }
            key = this._key(key);
            if (key in this.settings) {
                return this.settings[key];
            }

            return null;
        }

        /**
         * This is here for migrating settings from e.g. lighting_lookat_[property] to [property]
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

        name() {
            return this.__proto__.constructor.name;
        }
    }
}