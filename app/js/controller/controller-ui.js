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
    };
}
