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
        types;

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

        set(key, value) {
            if (key in this.settings) {
                this.properties[key] = this.validate(key, value)
            }
        }

        validate(key, value) {
            let type = typeof value;
            // check if string contains float and then convert
            if (type == 'string') {
                let f = parseFloat(value);
                if (f && f.toString().length == value.length) {
                    value = f;
                }
            }

            // avoid values to be overwritten by wrong type
            if (key in this.properties) {
                let org = this.properties[key];
                let otype = typeof org;

                if (otype !== type) {
                    // console.log(item, type, value, otype, org);
                    value = org;
                }
            }

            return value;
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

        fromJSON(json) {
            let data = JSON.parse(json);

            for (let k in this.settings) {
                if (k in data) {
                    this.set(k, data[k]);
                }
            }
        }

        name() {
            return this.__proto__._name || this.__proto__.constructor.name;
        }
    }
}

{
    /**
     *
     * @type {HC.ControlSetUi}
     */
    HC.ControlSetUi = class ControlSetUi {
        
        controlSet;
        folder;
        
        construct(controlSet) {
            this.controlSet = controlSet
        }
        
        addFolder(parent, actions) {
            let key = this.controlSet.name();
            this.folder = parent.addFolder(key);
            this.folder.__ul.parentNode.parentNode.setAttribute('data-id', key);

            if (actions) {
                this._addShareListener(key, this.folder, false);
            }

            return this.folder;
        }
        
        addControls() {


        }

        _addControl(options, settings, values, ksub, dir, removePrefix) {

        }

        _addShareListener(key, dir, datasource) {
            let ul = dir.__ul;
            let li = ul.lastChild;
            let ac = document.createElement('div');
            ac.setAttribute('class', 'actions');

            let sy = document.createElement('div');
            sy.setAttribute('class', 'sync');

            sy.addEventListener('click', function () {

                if (sy.classList.contains('selected')) {
                    controller.setSynchronized(key, false);
                    sy.setAttribute('class', 'sync');

                } else {
                    controller.setSynchronized(key, true);
                    sy.setAttribute('class', 'sync selected');
                }

                dir.closed = !dir.closed; // no toggle folder tweak
            });

            ac.appendChild(sy);

            let sh = document.createElement('div');
            sh.setAttribute('class', 'share');

            sh.addEventListener('click', function () {
                // share to all layers
                controller.shareSettings(key, datasource);
                dir.closed = !dir.closed;  // no toggle folder tweak
            });

            ac.appendChild(sh);

            li.appendChild(ac);
        }

        onChange(value) {

        }
    }
}