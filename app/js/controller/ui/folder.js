/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.GuifyFolder}
     */
    HC.GuifyFolder = class GuifyFolder extends HC.GuifyItem {

        /**
         *
         * @type {Object.<string, *>}
         */
        children = {};

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

        /**
         *
         * @param name
         * @param open
         * @returns {HC.GuifyFolder}
         */
        addFolder(name, open) {
            let folder = new HC.GuifyFolder(this.gui, this, name, open);
            this.children[folder.getLabel()] = folder;

            return folder;
        }

        /**
         *
         * @param opts {{}|HC.GuifyController}
         * @returns {Controller}
         */
        addController(opts) {

            let controller;
            if (opts instanceof HC.GuifyController) {
                controller = opts;

            } else {
                controller = new HC.GuifyController(this, opts);
            }

            this.children[controller.getLabel()] = controller;

            return controller;
        }

        /**
         *
         * @param label
         * @param options
         * @param onChange
         * @param opts
         */
        addSelectController(label, property, object, options, onChange, opts) {
            opts = this._buildControllerOptions('select', label, property, object, onChange, opts);
            opts.options = options;

            return this.addController(opts);
        }

        /**
         *
         * @param type
         * @param label
         * @param property
         * @param object
         * @param onChange
         * @param opts
         * @return {number}
         * @private
         */
        _buildControllerOptions(type, label, property, object, onChange, opts) {
            opts = opts || {};
            opts.type = type;
            opts.label = label;
            opts.property = property;
            opts.object = object;
            opts.onChange = onChange;

            return opts;
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
         */
        remove() {
            if (super.remove()) {
                for (let k in this.children) {
                    this.getChild(k).remove();
                }
            }
        }

        /**
         *
         * @param key
         */
        removeChild(key) {
            this.children[key].remove();
            delete this.children[key];
        }

        /**
         *
         */
        removeChildren() {
            for (let f in this.children) {
                this.getChild(f).remove();
                delete this.children[f];
            }
        }

        /**
         *
         * @param key
         * @param parent
         * @return {*|boolean|HC.GuifyFolder|boolean}
         */
        findFolderByKey(key, parent) {
            parent = parent || this;

            for (let k in parent.children) {
                let child = parent.getChild(k);

                if (child instanceof HC.GuifyFolder) {
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
         * @return {*|boolean|HC.GuifyFolder|boolean}
         */
        findControlByProperty(property, parent) {
            parent = parent || this;

            for (let k in parent.children) {
                let child = parent.getChild(k);

                if (child instanceof HC.GuifyFolder) {
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
         * @return {boolean}
         */
        isExpanded() {
            return this.component.open;
        }

        /**
         *
         * @param exp
         */
        setOpen(exp) {
            this.component.SetOpen(exp);
        }

        /**
         *
         */
        toggle() {
            this.component.Toggle();
        }

        /**
         *
         * @return {Array}
         */
        getFolders() {
            let folders = [];
            for (let k in this.children) {
                let c = this.getChild(k);
                if (c instanceof HC.GuifyFolder) {
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
                if (c instanceof HC.GuifyController) {
                    controllers.push(c);
                }
            }

            return controllers;
        }

        /**
         *
         * @param char
         */
        toggleByMnemonic(char) {
            for (let k in this.children) {
                let child = this.getChild(k);

                if (child.getMnemonic() == char) {
                    child.mnemonicAction();
                }
            }
        }

        /**
         *
         */
        mnemonicAction() {
            this.setOpen(true);
        }
    }
}
