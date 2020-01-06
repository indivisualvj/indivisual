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
         */
        parent;

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
         * @param name
         */
        constructor(name) {
            this._className = name;
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
            return JSON.parse(JSON.stringify(this.settings, null, 4));
        }

        /**
         *
         * @returns {boolean}
         */
        isDefault() {
            for (let key in this.settings) {
                let set = this.settings[key];
                let prop = this.properties[key];

                if (set != prop) {
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
            let type = typeof value;
            // _check if string contains float and then convert
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
    }
}

{
    /**
     *
     * @type {HC.StaticControlSet}
     */
    HC.StaticControlSet = class StaticControlSet extends HC.ControlSet {

        /**
         * check might this be the better way to copy instead of JSON.parse etc?
         * @returns Object
         */
        defaults() {
            let _copy = function (settings) {
                let props = {};
                for (let key in settings) {
                    let value = settings[key];

                    if (typeof value !== 'object') {
                        props[key] = value;
                    } else {
                        props[key] = _copy(value);
                    }
                }

                return props;
            };

            return _copy(this.settings);
        }
    }
}

{
    /**
     *
     * @type {HC.ControlSetUi}
     */
    HC.ControlSetUi = class ControlSetUi {

        /**
         * @type {HC.ControlSet}
         */
        controlSet;

        /**
         * @type {guify}
         */
        folder;

        /**
         *
         * @type {{}}
         */
        folders = {};

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
            let key = this.controlSet.className();
            let name = this.controlSet.name()
            this.folder = parent.addFolder(name);
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

            // _check if hidden
            if (types && types.length > 0) {
                if(types[types.length - 1] == 'hidden') {
                    return;
                }
            }

            if (typeof value == 'number' && types && types.length > 2) {
                let min = types[0];
                let max = types[1];
                let step = types[2];

                ctl = this.folder.add(props, key, min, max, step);
                let el = ctl.domElement.getElementsByTagName('input')[0];
                el.setAttribute('data-step', step);

            } else {
                let vls = this.controlSet.values[key] || null;
                ctl = this.folder.add(props, key, vls);
            }

            // shorten name by regexp
            let reg = new RegExp('\\w+_([^_]+)$');
            let name = key.replace(reg, '$1');
            ctl.name(name);

            // set width
            if (types) {
                if (types.length > 0) {
                    ctl.__li.setAttribute('data-class', types[types.length - 1]);
                }
            }

            // add listener
            if (ctl instanceof dat.controllers.NumberControllerBox
                || ctl instanceof dat.controllers.NumberControllerSlider
            ) {
                ctl.onChange(this.onChange);

            } else {
                ctl.onFinishChange(this.onChange);
            }

            // set meta
            ctl.__li.setAttribute('data-id', key);
            ctl._parent = this.folder;
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

            controller.updateSetting(
                statics.ControlSettings.layer,
                data,
                true,
                true,
                false
            );

            HC.log(this.object.name + '/' + this.property, value);
        }
    }
}

{
    /**
     *
     * @type {HC.ControlsetGuifyUi}
     */
    HC.ControlSetGuifyUi = class ControlsetGuifyUi extends HC.ControlSetUi {

        /**
         * @type {guify}
         */
        gui;

        /**
         *
         * @param controlSet
         * @param gui
         */
        constructor(controlSet, gui) {
            super(controlSet);
            this.gui = gui;
        }

        /**
         *
         */
        addControls() {

            let control;
            for(let key in this.controlSet.settings) {
                control = this.addControl(key);
            }

            let clear = document.createElement('div');
            clear.classList.add('guify-component-container');
            clear.classList.add('clear');
            this.folder.folderContainer.appendChild(clear);

            this.folder.folderContainer.setAttribute('data-border', 'red');
        }

        /**
         *
         * @return {guify}
         */
        addFolder() {
            let key = this.controlSet.className();
            let name = this.controlSet.name();

            if (this.controlSet.parent && !(this.controlSet.parent in this.gui.opts.folders)) {
                let folder = this.gui.Register({
                    type: 'folder',
                    label: this.controlSet.parent,
                    open: false
                });

                this.gui.opts.folders[this.controlSet.parent] = folder;
            }

            this.folder = this.gui.Register({
                type: 'folder',
                label: name,
                open: this.controlSet.open,
                set: key,
                controllers: {},
                folder: this.controlSet.parent
            });

            // this._addShareListener(key, this.folder, false);

            return this.folder;
        }

        /**
         *
         * @param key
         */
        addControl(key) {
            let types = this.controlSet.types[key] || false;
            let styles = this.controlSet.styles[key] || false;
            let props = this.controlSet.properties;
            let values = this.controlSet.values[key] || false;
            let value = props[key];
            let parent = this.controlSet.parents[key] || undefined;

            if (parent && !this.folders[parent]) {
                let pf = this.gui.Register({
                    type: 'folder',
                    label: parent,
                    open: false,
                    folder: this.controlSet.parent || this.folder.opts.label
                });
                this.folders[parent] = pf;
            }

            // _check if hidden
            if (types && types.length > 0) {
                if(types[types.length - 1] == 'hidden') {
                    return;
                }
            }

            // shorten name by regexp
            let reg = new RegExp('\\w+_([^_]+)$');
            let name = key.replace(reg, '$1');

            let config = {
                type: 'text',
                label: name,
                object: props,
                property: key,
                onChange: this.onChange,
                folder: parent || this.folder.opts.label,
                parent: this.folder,
                set: this.controlSet.className()
            };

            if (typeof value == 'function') {
                config.type = 'button';
                config.action = value;
                delete config.onChange;
                delete config.property;
                delete config.object;

            } else if (typeof value == 'number' && types && types.length > 2) {
                if (true) {
                    config.type = 'range';
                    let min = types[0];
                    let max = types[1];
                    let step = types[2];
                    config.min = min;
                    config.max = max;
                    config.step = step;
                }

            } else if (typeof value == 'boolean') {
                config.type = 'checkbox';

            } else if (typeof value == 'string' && value.startsWith('#')) {
                config.type = 'color';
                config.format = 'hex';

            } else if (values) {
                config.type = 'select';
                config.options = values;
            }

            this.folder.opts.controllers[key] = this.gui.Register(config);

            if (styles) {
                this.folder.opts.controllers[key].container.setAttribute('data-class', styles[0]);

                if (styles.length > 1) {
                    this.folder.opts.controllers[key].container.classList.add(styles[styles.length - 1]);

                } else {
                    this.folder.opts.controllers[key].container.classList.add('noclear');
                }
            }

            return this.folder.opts.controllers[key];

        }

        /**
         *
         * @param value
         */
        onChange(value) {
            let data = {};
            data[this.set] = {};
            data[this.set][this.property] = value;

            controller.updateSetting(
                statics.ControlSettings.layer,
                data,
                true,
                true,
                false
            );

            HC.log(this.set + '/' + this.property, value);

        }
    }
}

{
    /**
     *
     * @type {HC.ShaderPassUi}
     */
    HC.ShaderPassUi = class ShaderPassUi {

        shader;
        name;

        /**
         *
         * @param name
         */
        constructor(name) {
            this.name = name;
        }

        /**
         *
         * @param shader
         */
        init(shader) {
            shader.apply = true;
            this.setShader(shader);
        }

        /**
         *
         * @returns {*}
         */
        getShader() {
            return this.shader;
        }

        /**
         *
         * @param sh
         */
        setShader(sh) {
            this.shader = sh;
        }

        /**
         *
         * @param v
         */
        onChange(v) {
            if (this.property == 'apply' && v === false) {
                controller.cleanShaderPasses();
                controller.updateUiPasses();
            }

            let passes = cm.get(statics.ControlSettings.layer, 'passes');
            let data = {passes: {shaders: passes.getShaderPasses()}};
            messaging.emitSettings(statics.ControlSettings.layer, data, false, false, false);

            let name = this.__gui ? this.__gui.name : this.property;
            HC.log(name + '/' + this.property, v);
        }

        /**
         *
         * @return {*}
         */
        getInitialSettings() {
            return statics.ShaderSettings[this.name];
        }

        /**
         *
         * @param v
         */
        static onPasses(v) {

            if (v in statics.Passes) {
                let name = statics.Passes[v];
                let ctrl = new HC.ShaderPassUi(name);
                let sh = JSON.copy(statics.ShaderSettings[name]);
                ctrl.init(sh);

                controller.addShaderPass(
                    statics.ControlSettings.layer,
                    ctrl
                );
            }
        }
    }
}