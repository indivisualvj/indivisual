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
         *
         * @param {HC.ControlSet} controlSet
         */
        constructor(controlSet) {
            this.controlSet = controlSet
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {string} key
         * @param {boolean} dataSource
         * @private
         */
        _addShareListener(element, key, dataSource) {
            let li = element.lastChild;
            let ac = document.createElement('div');
            ac.setAttribute('class', 'actions');

            let sy = document.createElement('div');
            sy.setAttribute('class', 'sync');

            sy.addEventListener('click', function (e) {

                if (sy.classList.contains('selected')) {
                    messaging.program.setSynchronized(key, false);
                    sy.setAttribute('class', 'sync');

                } else {
                    messaging.program.setSynchronized(key, true);
                    sy.setAttribute('class', 'sync selected');
                }

                e.preventDefault();
                e.stopPropagation();
            });

            ac.appendChild(sy);

            let sh = document.createElement('div');
            sh.setAttribute('class', 'share');

            sh.addEventListener('click', function (e) {
                // share to all layers
                messaging.program.shareSettings(key, dataSource);
                e.preventDefault();
                e.stopPropagation();
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
         * @type {HC.Guify}
         */
        gui;

        /**
         * @type {HC.GuifyFolder}
         */
        folder;

        /**
         *
         * @param {HC.ControlSet} controlSet
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
        addFolder(shareListener) {
            let key = this.controlSet.className();
            let name = this.controlSet.name();

            this.folder = this.gui.addFolder(key, name, this.controlSet.open);
            this._styleFolder(this.folder, key, 'green');

            if (shareListener === true) {
                this._addShareListener(this.folder.getContainer(), key, false);
            }

            return this.folder;
        }

        /**
         *
         * @param folder
         * @param key
         * @param border
         * @private
         */
        _styleFolder(folder, key, border) {
            let container = folder.getFolderContainer();

            container.setAttribute('data-border', border);
            container.setAttribute('data-id', key);
            if (this.folder.getParent()) {
                container.setAttribute('data-parent', this.folder.getParent().getLabel());
            }
        }

        /**
         *
         * @param folder
         * @private
         */
        _finishFolder(folder) {
            let clear = document.createElement('div');
            clear.classList.add('guify-component-container');
            clear.classList.add('clear');
            folder.getFolderContainer().appendChild(clear);
        }

        /**
         *
         * @param key
         */
        addController(key) {
            let events = this.controlSet.events[key] || false;
            let types = this.controlSet.types[key] || false;
            let styles = this.controlSet.styles[key] || false;
            let props = this.controlSet.properties;
            let values = this.controlSet.values[key] || false;
            let parent = this.controlSet.parents[key] || undefined;
            let value = props[key];
            let folder = this.folder;

            if (parent) {
                if (!this.folder.children[parent]) {
                    folder = this.folder.addFolder(parent);
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
                // key: key,
                onChange: this.onChange,
                set: this.controlSet.className(),
                initial: props[key]
            };

            if (types[types.length - 1] == 'display') {
                config.type = 'display';
                // config.label = '';
                delete config.onChange;
                // delete config.property;
                delete config.object;

            } else if (typeof value == 'function') {
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
                config.type = 'text';
                // config.format = 'hex';

            } else if (values) {
                config.type = 'select';
                config.options = values;
            }

            let controller = folder.addController(config);
            let ctrl = controller.getComponent();

            if (styles) {
                ctrl.container.setAttribute('data-class', styles[0]);

                if (styles.length > 1) {
                    ctrl.container.classList.add(styles[styles.length - 1]);

                } else {
                    ctrl.container.classList.add('noclear');
                }
            }

            if (events) {
                let e = events(this.controlSet);
                controller.setMnemonic(e.label);
                e.register(window);
            }

            return controller;

        }

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            let data = {};
            let set = that.getParent().getKey();
            data[set] = {};
            data[set][that.getProperty()] = value;

            messaging.program.updateSetting(
                undefined,
                data,
                true,
                true,
                false
            );

            HC.log(set + '/' + that.getProperty(), value);

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
         * @type {HC.Config}
         */
        config;

        /**
         *
         * @param name
         * @param {HC.Config} config
         */
        constructor(name, config) {
            this.name = name;
            this.config = config;
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
         * @returns {function(...[*]=)}
         */
        onChange() {
            return (v, that) => {
                if (that.getProperty() == 'apply' && v === false) {
                    messaging.program.cleanShaderPasses();
                    messaging.program.updateUiPasses();
                }

                let passes = messaging.program.settingsManager.get(this.config.ControlSettings.layer, 'passes');
                let data = {passes: {shaders: passes.getShaderPasses()}};
                messaging.emitSettings(this.config.ControlSettings.layer, data, false, false, false);

                HC.log(that.getParent().getLabel() + '/' + that.getLabel(), v);
            };
        }

        /**
         *
         * @return {*}
         */
        getInitialSettings() {
            return this.config.ShaderSettings[this.name];
        }

        /**
         *
         * @param v
         * @param that
         */
        static onPasses(v, that) {

            if (v !== null && v in messaging.program.config.AnimationValues.shaders) {
                let name = messaging.program.config.AnimationValues.shaders[v];
                if (name !== null) {

                    setTimeout(() => {
                        that.setValue(0);
                    }, 125);

                    let ctrl = new HC.ShaderPassUi(v);
                    let sh = JSON.copy(messaging.program.config.ShaderSettings[v]);
                    ctrl.init(sh);

                    messaging.program.addShaderPass(
                        undefined,
                        ctrl
                    );
                }
            }
        }
    }
}
