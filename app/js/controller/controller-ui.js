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
        }

        /**
         *
         * @param name
         * @param open
         * @returns {Folder}
         */
        addFolder(name, open) {
            let folder = new Folder(this.gui, null, name, open);
            this.children[folder.getLabel()] = folder;

            return folder;
        }

        /**
         *
         * @param opts
         * @returns {Controller}
         */
        addController(opts) {
            let controller = new Controller(this, opts);
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

        getParent() {
            return null;
        }
    };

    /**
     *
     */
    class Folder {

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
         * @returns {Folder}
         */
        addFolder(name, open) {
            let folder = new Folder(this.gui, this, name, open);
            this.children[folder.getLabel()] = folder;

            return folder;
        }

        /**
         *
         * @param opts
         * @returns {Controller}
         */
        addController(opts) {
            let controller = new Controller(this, opts);
            this.children[controller.getLabel()] = controller;

            return controller;
        }

        /**
         *
         * @param name
         * @returns {*}
         */
        getChild(name) {
            return this.children[name];
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
         * @returns {string}
         */
        getLabel() {
            return this.folder.opts.label;
        }
    }

    /**
     *
     */
    class Controller {
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
         * @returns {*}
         */
        getParent() {
            return this.parent;
        }
    }
}
