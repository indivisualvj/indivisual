/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.ControllerUi = class ControllerUi {

        /**
         * @type {guify}
         */
        gui;

        children = {};

        /**
         *
         * @param id
         * @param open
         */
        constructor(id, open) {
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
         * @param name
         * @param open
         * @returns {Folder}
         */
        addFolder(name, open) {
            let folder = new HC.ControllerUi.Folder(this.gui, null, name, open);
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
         * @param key
         * @return {*}
         */
        getChild(key) {
            return this.children[key];
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
            // todo how to set gui open/closed?
        }

        /**
         *
         * @return {*}
         */
        getContainer() {
            return this.gui.container;
        }
    };

    /**
     *
     */
    HC.ControllerUi.Folder = class Folder {

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

        /**
         *
         * @param gui
         * @param parent
         * @param name
         * @param open
         */
        constructor(gui, parent, name, open) {
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
         * @returns {HC.ControllerUi.Controller}
         */
        addController(opts) {
            let controller = new HC.ControllerUi.Controller(this, opts);
            this.children[controller.getLabel()] = controller;

            return controller;
        }

        /**
         *
         * @param key
         * @returns {*}
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
    };

    /**
     *
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

            } else if (this.controller.opts.type === 'checkbox') {
                this._initCheckboxEvents();
            }

            this._initInputEvents();
        }

        _initCheckboxEvents() {
            this.controller.container.addEventListener('mousedown', (e) => {
                this.toggleValue();
            });
        }

        /**
         *
         * @private
         */
        _initInputEvents() {

            let valueCompondent = this.controller.valueComponent || this.controller.input;
            if (!valueCompondent) {
                return;
            }

            valueCompondent.addEventListener('keydown', function (e) {
                if (e.ctrlKey && (e.shiftKey || e.altKey)) {
                    return;
                }

                if (valueCompondent.nodeName === 'INPUT') {
                    if (e.keyCode == 27) { // ESCAPE
                        this.focus();
                        valueCompondent.blur();
                        this.focus();
                        valueCompondent.blur();
                        e.preventDefault();
                        e.stopPropagation();

                    } else if (e.keyCode == 9) { // TAB
                        e.preventDefault();
                        e.stopPropagation();

                    }

                } else if (valueCompondent.nodeName === 'SELECT') {
                    if (e.keyCode == 8 || e.keyCode == 27) { // BACKSPACE | ESCAPE
                        this.focus();
                        valueCompondent.blur();
                        this.focus();
                        valueCompondent.blur();
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
                    if (dy < 0) {
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
            return this.controller.opts.object[this.getProperty()];
        }

        /**
         *
         * @param v
         * @return {*}
         */
        setValue(v) {
            this.controller.opts.object[this.getProperty()] = v;
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
        }

        /**
         *
         */
        incrementValue() {
            let v = this.getValue();
            let s = this.getStep();
            this.setValue(v + s);
        }

        /**
         *
         */
        decrementValue() {
            let v = this.getValue();
            let s = this.getStep();
            this.setValue(v - s);
        }
    };
}
