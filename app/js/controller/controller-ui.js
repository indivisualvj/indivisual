/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.GuifyFolder}
     */
    HC.GuifyFolder = class GuifyFolder {

        /**
         * @type {guify}
         */
        gui;

        parent;

        folder;

        /**
         *
         * @type {Object.<string, *>}
         */
        children = {};

        mnemonic;

        /**
         *
         * @param name
         * @param open
         * @returns {HC.ControllerUi.Folder}
         */
        addFolder(name, open) {
            let folder = new HC.ControllerUi.Folder(this.gui, this, name, open);
            this.children[folder.getLabel()] = folder;

            return folder;
        }

        /**
         *
         * @param opts
         * @returns {Controller}
         */
        addController(opts) {
            let controller = new HC.ControllerUi.Controller(this, opts);
            this.children[controller.getLabel()] = controller;

            return controller;
        }

        /**
         *
         * @param key
         * @return {*}
         */
        getChild(key) {
            return this.children[key];
        }

        /**
         *
         * @returns {HC.ControllerUi.Folder}
         */
        getParent() {
            return this.parent;
        }

        /**
         *
         * @param key
         * @param parent
         * @return {*|boolean|HC.ControllerUi.Folder|boolean}
         */
        findFolderByKey(key, parent) {
            parent = parent || this;

            for (let k in parent.children) {
                let child = parent.getChild(k);

                if (child instanceof HC.ControllerUi.Folder) {
                    if (k == key) {
                        return child;
                    }

                    child = this.findFolderByKey(key, child);
                    if (child) {
                        return child;
                    }
                }
            }

            return false;
        }

        /**
         *
         * @param property
         * @param parent
         * @return {*|boolean|HC.ControllerUi.Folder|boolean}
         */
        findControlByProperty(property, parent) {
            parent = parent || this;

            for (let k in parent.children) {
                let child = parent.getChild(k);

                if (child instanceof HC.ControllerUi.Folder) {
                    child = this.findControlByProperty(property, child);
                    if (child) {
                        return child;
                    }
                } else {
                    if (child.getProperty() == property) {
                        return child;
                    }
                }
            }

            return false;
        }

        /**
         *
         * @returns {string}
         */
        getLabel() {
            return this.folder.opts.label;
        }

        /**
         *
         * @return {boolean}
         */
        isExpanded() {
            return this.folder.open;
        }

        /**
         *
         * @param exp
         */
        setExpanded(exp) {
            this.folder.SetOpen(exp);
        }

        /**
         *
         * @return {HTMLDivElement}
         */
        getContainer() {
            return this.folder.container;
        }

        /**
         *
         * @return {Array}
         */
        getFolders() {
            let folders = [];
            for (let k in this.children) {
                let c = this.getChild(k);
                if (c instanceof HC.ControllerUi.Folder) {
                    folders.push(c);
                }
            }

            return folders;
        }

        /**
         *
         * @return {Array}
         */
        getControllers() {
            let controllers = [];
            for (let k in this.children) {
                let c = this.getChild(k);
                if (c instanceof HC.ControllerUi.Controller) {
                    controllers.push(c);
                }
            }

            return controllers;
        }

        /**
         *
         * @param v
         */
        setVisible(v) {
            this.setExpanded(false);
            this.folder.container.style.display = v ? 'block' : 'none';
        }

        /**
         *
         * @param key
         */
        setMnemonic(key) {
            this.mnemonic = key.length < 2 ? key : null;
            this.folder.container.setAttribute('data-mnemonic', key)
        }

        /**
         *
         * @return {*}
         */
        getMnemonic() {
            return this.mnemonic;
        }
    };

    /**
     *
     * @type {HC.ControllerUi}
     */
    HC.ControllerUi = class ControllerUi extends HC.GuifyFolder {

        /**
         *
         * @param id
         * @param open
         */
        constructor(id, open) {
            super();
            this.gui = new guify({
                title: id,
                theme: 'dark', // dark, light, yorha, or theme object
                align: 'right', // left, right
                width: '100%',
                barMode: 'offset', // none, overlay, above, offset
                panelMode: 'inner',
                opacity: 1,
                root: document.getElementById(id),
                open: open
            });

            this.gui.container.style.zIndex = 998;
        }

        /**
         *
         * @returns {string}
         */
        getLabel() {
            return this.gui.opts.title;
        }

        /**
         *
         * @return {null}
         */
        getParent() {
            return null;
        }

        /**
         *
         * @return {boolean}
         */
        isExpanded() {
            let style = window.getComputedStyle(this.gui.panel.panel);
            let display = style.getPropertyValue('display');

            return display != 'none';
        }

        /**
         *
         * @param exp
         */
        setExpanded(exp) {
            this.gui.panel.SetVisible(exp);
        }

        /**
         *
         * @return {*}
         */
        getContainer() {
            return this.gui.container;
        }

        /**
         *
         * @param key
         */
        setMnemonic(key) {
            this.mnemonic = key;
            this.gui.container.setAttribute('data-mnemonic', key)
        }
    };

    /**
     *
     * @type {HC.ControllerUi.Folder}
     */
    HC.ControllerUi.Folder = class Folder extends HC.GuifyFolder {

        /**
         * @type {string}
         */
        key;

        /**
         *
         * @param gui
         * @param parent
         * @param name
         * @param open
         */
        constructor(gui, parent, name, open) {
            super();
            this.gui = gui;
            this.parent = parent;
            this.folder = this.gui.Register({
                type: 'folder',
                label: name,
                folder: (parent ? parent.folder : null),
                open: open
            });
        }

        /**
         *
         * @param key
         */
        setKey(key) {
            this.key = key;
        }

        /**
         *
         * @return {string}
         */
        getKey() {
            return this.key;
        }
    };

    /**
     *
     * @type {HC.ControllerUi.Controller}
     */
    HC.ControllerUi.Controller = class Controller {

        /**
         * @type {guify}
         */
        gui;

        /**
         *
         */
        controller;

        mnemonic;

        /**
         *
         * @param parent
         * @param opts
         * @returns {*}
         */
        constructor(parent, opts) {
            this.parent = parent;
            this.gui = parent.gui;
            opts.folder = parent.folder;
            this.controller = this.gui.Register(opts);

            this.initEvents();
        }

        /**
         *
         */
        initEvents() {
            if (this.controller.opts.type == 'range') {
                this._initRangeEvents();

            }

            this._initInputEvents();
        }

        /**
         *
         * @private
         */
        _initInputEvents() {

            let valueComponent = this.controller.valueComponent || this.controller.input;
            if (!valueComponent) {
                return;
            }

            valueComponent.addEventListener('keydown', function (e) {
                if (e.ctrlKey && (e.shiftKey || e.altKey)) {
                    return;
                }

                e.stopPropagation();

                if (valueComponent.nodeName === 'INPUT') {
                    if (e.keyCode == 27) { // ESCAPE
                        this.focus();
                        valueComponent.blur();
                        this.focus();
                        valueComponent.blur();
                        e.preventDefault();
                        e.stopPropagation();

                    } else if (e.keyCode == 9) { // TAB
                        e.preventDefault();
                        e.stopPropagation();

                    }

                } else if (valueComponent.nodeName === 'SELECT') {
                    if (e.keyCode == 8 || e.keyCode == 27) { // BACKSPACE | ESCAPE
                        this.focus();
                        valueComponent.blur();
                        this.focus();
                        valueComponent.blur();
                        e.preventDefault();
                        e.stopPropagation();

                    }
                }
            });
        }

        /**
         *
         * @private
         */
        _initRangeEvents() {
            let active = false;
            let valueCompondent = this.controller.valueComponent;

            valueCompondent.addEventListener('keyup', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (e.keyCode == 38) { // UP
                    this.incrementValue();

                } else if (e.keyCode == 40) { // DOWN
                    this.decrementValue();
                }
            });

            valueCompondent.addEventListener('mousedown', function (e) {
                active = true;
            });

            window.addEventListener('mousemove', (e) => {
                if (active) {
                    let dy = e.movementY;
                    if (dy < 0) { // todo make it depend on screen resolution
                        this.incrementValue();

                    } else if (dy > 0) {
                        this.decrementValue();
                    }
                }
            });

            window.addEventListener('mouseup', function (e) {
                active = false;
            });
        }

        /**
         *
         * @returns {string}
         */
        getLabel() {
            return this.controller.opts.label;
        }

        /**
         *
         * @return {string}
         */
        getProperty() {
            return this.controller.opts.property || this.getLabel();
        }

        /**
         *
         * @returns {*}
         */
        getParent() {
            return this.parent;
        }

        /**
         *
         * @return {HTMLDivElement}
         */
        getContainer() {
            return this.controller.container;
        }

        /**
         *
         * @return {*}
         */
        getValue() {
            if (this.controller.opts.object && this.getProperty() in this.controller.opts.object) {
                return this.controller.opts.object[this.getProperty()];
            }

            return undefined;
        }

        /**
         *
         * @param v
         * @return {*}
         */
        setValue(v) {
            if (this.controller.opts.object && this.getProperty() in this.controller.opts.object) {
                this.controller.opts.object[this.getProperty()] = v;
            }
        }

        /**
         *
         * @return {number}
         */
        getStep() {
            return this.controller.opts.step;
        }

        /**
         *
         */
        toggleValue() {
            let v = this.getValue();
            this.setValue(!v);
            this.controller.emit('input', this.getValue());
        }

        /**
         *
         */
        incrementValue() {
            let v = this.getValue();
            let s = this.getStep();
            this.setValue(v + s);
            this.controller.emit('input', this.getValue());
        }

        /**
         *
         */
        decrementValue() {
            let v = this.getValue();
            let s = this.getStep();
            this.setValue(v - s);
            this.controller.emit('input', this.getValue());
        }

        /**
         *
         * @return {*|Array|*[]}
         */
        getInitialValue() {
            if ('initial' in this.controller.opts) {
                let initial = this.controller.opts.initial;
                return initial;
            }

            return undefined;
        }

        /**
         *
         * @return {boolean}
         */
        isModified() {
            let value = this.getValue();
            let initial = this.getInitialValue();
            if (value !== undefined && initial !== undefined) {
                return value !== initial;
            }

            return false;
        }

        /**
         *
         * @param v
         */
        setVisible(v) {
            this.controller.container.style.display = v ? 'block' : 'none';
        }

        /**
         *
         */
        catchFocus() {
            if (this.controller.opts.type == 'checkbox') {
                this.toggleValue();

            } else {
                let elem = this.controller.valueComponent || this.controller.input;
                if (elem) {
                    elem.focus();
                }
            }
        }

        /**
         *
         * @param key
         */
        setMnemonic(key) {
            this.mnemonic = key.length < 2 ? key : null;
            this.controller.container.setAttribute('data-mnemonic', key)
        }

        /**
         *
         * @return {*}
         */
        getMnemonic() {
            return this.mnemonic;
        }
    };
}
