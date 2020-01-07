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
            let folder = new Folder(this.gui, name, null, open);
            this.children[folder.getLabel()] = folder;

            return folder;
        }

        /**
         *
         * @param opts
         * @returns {Controller}
         */
        addController(opts) {
            let controller = new Controller(this.gui, opts);
            this.children[controller.getLabel()] = controller;

            return controller;
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

        children = {};

        /**
         *
         * @param gui
         * @param name
         * @param parent
         * @param open
         */
        constructor(gui, name, parent, open) {
            this.gui = gui;
            this.parent = parent;
            this.folder = this.gui.Register({
                type: 'folder',
                label: name,
                folder: parent ? parent.getLabel() : null,
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
            let folder = new Folder(this.gui, name, this, open);
            this.children[folder.getLabel()] = folder;

            return folder;
        }

        /**
         *
         * @param opts
         * @returns {Controller}
         */
        addController(opts) {
            opts.folder = this.getLabel();
            let controller = new Controller(this.gui, opts);
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
         * @param gui
         * @param opts
         * @returns {*}
         */
        constructor(gui, opts) {
            this.gui = gui;
            this.controller = this.gui.Register(opts);
        }

        /**
         *
         * @returns {string}
         */
        getLabel() {
            return this.controller.opts.label;
        }
    }
}