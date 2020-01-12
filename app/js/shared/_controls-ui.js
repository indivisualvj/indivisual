/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

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
         * @type {Folder}
         */
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
    }
}

{
    /**
     *
     * @type {HC.ControlsetGuifyUi}
     */
    HC.ControlSetGuifyUi = class ControlsetGuifyUi extends HC.ControlSetUi {

        /**
         * @type {HC.ControllerUi}
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
        addControllers() {

            let folders = {};
            for(let key in this.controlSet.settings) {
                let ctrl = this.addController(key);
                if (ctrl) {
                    folders[ctrl.getParent().getLabel()] = ctrl.getParent();
                }

            }

            for (let k in folders) {
                this._finishFolder(folders[k]);
            }
        }

        /**
         *
         * @param parent
         * @returns {guify}
         */
        addFolder() {
            let key = this.controlSet.className();
            let name = this.controlSet.name();

            this.folder = this.gui.addFolder(name, this.controlSet.open);
            this.folder.setKey(key);
            this._styleFolder(this.folder, key, 'green');

            // this._addShareListener(key, this.folder, false);

            return this.folder;
        }

        _styleFolder(folder, key, border) {
            let fld = folder.folder;

            fld.folderContainer.setAttribute('data-border', border);
            fld.folderContainer.setAttribute('data-id', key);
            if (this.folder.getParent()) {
                fld.folderContainer.setAttribute('data-parent', this.folder.getParent().getLabel());
            }
        }

        _finishFolder(folder) {
            let clear = document.createElement('div');
            clear.classList.add('guify-component-container');
            clear.classList.add('clear');
            folder.folder.folderContainer.appendChild(clear);
        }

        /**
         *
         * @param key
         */
        addController(key) {
            let types = this.controlSet.types[key] || false;
            let styles = this.controlSet.styles[key] || false;
            let props = this.controlSet.properties;
            let values = this.controlSet.values[key] || false;
            let parent = this.controlSet.parents[key] || undefined;
            let value = props[key];
            let folder = this.folder;

            if (parent) {
                if (!this.folder.children[parent]) {
                    folder = this.folder.addFolder(parent, false);
                    this._styleFolder(folder, parent,'blue');
                } else {
                    folder = this.folder.children[parent];
                }
            }

            // _check if hidden
            if (types && types.length > 0) {
                if(types[types.length - 1] == 'hidden') {
                    return;
                }
            }

            // shorten name by regexp
            let reg = new RegExp('^' + folder.getLabel() + '(.+)');
            // let reg = new RegExp('\\w+_([^_]+)$');
            let name = key.replace(reg, '$1');

            let config = {
                type: 'text',
                label: name,
                object: props,
                property: key,
                onChange: this.onChange,
                set: this.controlSet.className(),
                initial: props[key]
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

            let controller = folder.addController(config);
            let ctrl = controller.controller;

            if (styles) {
                ctrl.container.setAttribute('data-class', styles[0]);

                if (styles.length > 1) {
                    ctrl.container.classList.add(styles[styles.length - 1]);

                } else {
                    ctrl.container.classList.add('noclear');
                }
            }

            return controller;

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
