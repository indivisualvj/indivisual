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

            let submit = this.onChange;
            let dir = this.folder;
            let values = this.controlSet.settings;

            let controllers = statics.AnimationController[this.controlSet.name()];
            for (let ksub in controllers) {
                let options = controllers;
                if (options[ksub]
                    && typeof options[ksub] == 'object'
                    && (ksub.match(/^_.+/))
                ) {
                    options = options[ksub];
                    let _dir = this.folder.addFolder(ksub);
                    _dir.__ul.parentNode.parentNode.setAttribute('data-id', ksub);
                    _dir.__ul.parentNode.parentNode.setAttribute('data-parent', key);

                    for (let _ksub in options) {
                        let ctl = this._addControl(options, settings, values, _ksub, _dir, submit, ksub.substr(1) + '_');
                        if (ctl) {
                            ctl.__li.setAttribute('data-parent', ksub);
                        }
                    }

                } else {
                    let ctl = this._addControl(options, settings, values, ksub, dir, submit, key + '_');
                    if (ctl) {
                        ctl.__li.setAttribute('data-parent', key);
                    }
                }
            }
        }

        _addControl(options, settings, values, ksub, dir, removePrefix) {
            let submit = this.onChange;
            let vsub = options[ksub];
            let types = this.controlSet.types;

            if (vsub === null) {
                return; // not visible

            } else if (ksub == 'open') {
                dir.open();

                return false; // prevent fucking it up later
            }

            let ctl = false;

            if (typeof vsub == 'function') {

                settings[ksub] = vsub;

                ctl = dir.add(settings, ksub);
                if (removePrefix) {
                    let reg = new RegExp('^' + removePrefix);
                    ctl.name(ksub.replace(reg, ''));
                }
                if (ksub in types) {
                    let bnd = types[ksub];
                    if (!bnd || bnd.length < 1) {
                        console.log('error in ' + ksub);
                    } else {
                        ctl.__li.setAttribute('data-class', bnd[0]);
                    }
                }

                ctl.__li.setAttribute('data-id', ksub);

                return ctl; // prevent fucking it up later

            } else if (ksub in values) { // dropdown

                let vls = values[ksub];
                if (typeof vls == 'object') {
                    ctl = dir.add(settings, ksub, vls);

                }

            } else {
                if (typeof vsub == 'number') {
                    if (ksub in types) {
                        let bnd = types[ksub];
                        let min = bnd[0];
                        let max = bnd[1];
                        let step = bnd[2];

                        ctl = dir.add(settings, ksub, min, max, step);
                        let el = ctl.domElement.getElementsByTagName('input')[0];
                        el.setAttribute('data-step', step);
                    }
                }
            }

            if (!ctl) {
                ctl = dir.add(settings, ksub);
            }

            if (ctl) {

                if (removePrefix) {
                    // pattern_padding_oscillate -> oscillate
                    // rotation_x_random -> random
                    let reg = new RegExp('\\w+_([^_]+)$');
                    let _ksub = ksub.replace(reg, '$1');
                    ctl.name(_ksub);
                    //ctl.name(ksub);
                }
                if (ksub.match(/[^0-9]+\d+_.+/)) {
                    ctl.name(ksub.replace(/[^0-9]+(\d+_.+)/, '$1'));
                }

                if (ksub in types) {
                    let bnd = types[ksub];
                    if (!bnd || bnd.length < 1) {
                        console.log('error in ' + ksub);
                    } else {
                        ctl.__li.setAttribute('data-class', bnd[bnd.length - 1]);
                    }
                }

                ctl.__li.setAttribute('data-id', ksub);

                if (ctl instanceof dat.controllers.NumberControllerBox
                    || ctl instanceof dat.controllers.NumberControllerSlider
                ) {
                    ctl.onChange(submit);
                } else {
                    ctl.onFinishChange(submit);
                }

                ctl._parent = dir;
            }

            return ctl;
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
            controller.updateSetting(statics.ControlSettings.layer, this.property, value, true, true, false);
        }
    }
}