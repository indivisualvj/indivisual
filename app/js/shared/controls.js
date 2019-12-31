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
         * @type {boolean}
         */
        visible = true;

        /**
         * definition of all available settings
         */
        settings;

        /**
         * actual settings
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
        values = {};

        /**
         *
         * @param name
         */
        constructor(name) {
            if (!this.__proto__._name) {
                this._name = name;
            } else {
                this._name = this.__proto__._name;
            }
        }

        /**
         *
         * @param pluggedValues
         * @param reset
         */
        init(pluggedValues, reset) {
            if (!this.properties || reset) {
                this.properties = this.defaults();
            }

            for (let key in this.settings) {
                if (key.endsWith('_oscillate')) {
                    this.values[key] = pluggedValues.oscillate;

                } else if (key in pluggedValues) {
                    this.values[key] = pluggedValues[key];
                }
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
         * @param value
         * @returns {*}
         */
        set(key, value) {
            if (key in this.settings) {
                this.properties[key] = this.validate(key, value)
            }

            return this.properties[key];
        }

        /**
         *
         * @param key
         * @param value
         * @returns {number}
         */
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

        // /**
        //  * set every each member of settings to data[member] if exists
        //  * @param data
        //  */
        // merge(data) {
        //     for (let key in this.settings) {
        //         if (key in data) {
        //             this.set(key, data[key]);
        //         }
        //     }
        // }
        //
        // /**
        //  *
        //  * @param key
        //  * @returns {null|*}
        //  */
        // getDefault(key) {
        //     if (key in this.settings) {
        //         return this.settings[key];
        //     }
        //     key = this._key(key);
        //     if (key in this.settings) {
        //         return this.settings[key];
        //     }
        //
        //     return null;
        // }

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

        /**
         *
         * @returns {*}
         */
        name() {
            return this._name;
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

        /**
         *
         * @param controlSet
         */
        constructor(controlSet) {
            this.controlSet = controlSet
        }

        /**
         *
         * @param parent
         * @returns {*}
         */
        addFolder(parent) {
            let key = this.controlSet.name();
            this.folder = parent.addFolder(key);
            this.folder.__ul.parentNode.parentNode.setAttribute('data-id', key);

            this._addShareListener(key, this.folder, false);

            return this.folder;
        }

        /**
         *
         */
        addControls() {
            
            for(let key in this.controlSet.settings) {
                this.addControl(key);
            }

        }

        /**
         *
         * @param key
         */
        addControl(key) {
            let types = this.controlSet.types[key];
            let props = this.controlSet.properties;
            let value = props[key];
            let ctl;
            
            if (typeof value == 'number' && types) {
                let bnd = types;
                let min = bnd[0];
                let max = bnd[1];
                let step = bnd[2];

                ctl = this.folder.add(props, key, min, max, step);
                let el = ctl.domElement.getElementsByTagName('input')[0];
                el.setAttribute('data-step', step);

            } else {
                let vls = this.controlSet.values[key] || null;
                ctl = this.folder.add(props, key, vls);
            }

            let reg = new RegExp('\\w+_([^_]+)$');
            let name = key.replace(reg, '$1');
            ctl.name(name);

            if (types) {
                let bnd = types;
                if (!bnd || bnd.length < 1) {
                    console.log('error in ' + key);
                } else {
                    ctl.__li.setAttribute('data-class', bnd[bnd.length - 1]);
                }
            }

            ctl.__li.setAttribute('data-id', key);

            let onChange = this.onChange;

            if (ctl instanceof dat.controllers.NumberControllerBox
                || ctl instanceof dat.controllers.NumberControllerSlider
            ) {
                ctl.onChange(onChange);
            } else {
                ctl.onFinishChange(onChange);
            }

            ctl._parent = this.folder;
            // ctl._controlSetUi = this;
            // ctl._controlSet = this.controlSet;
            ctl.object.name = this.controlSet.name();
        }


        /**
         *
         * @param key
         * @param dir
         * @param datasource
         * @private
         */
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

        /**
         *
         * @returns {Function}
         */
        onChange(value) {
            let data = {};
            data[this.object.name] = {};
            data[this.object.name][this.property] = value;

            controller.updateControlSet(
                statics.ControlSettings.layer,
                data,
                true,
                true,
                false
            );
        }
    }
}