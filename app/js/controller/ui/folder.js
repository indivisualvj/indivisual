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
            this.init(name, open);
        }

        /**
         *
         * @param name
         * @param open
         */
        init(name, open) {
            this.component = this.gui.Register({
                type: 'folder',
                label: name,
                folder: (this.getParent() ? this.getParent().getComponent() : null),
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
         * @param v
         */
        setVisible(v) {
            this.setOpen(false);
            super.setVisible(v);
        }

        /**
         *
         */
        getFolderContainer() {
            return this.getComponent().folderContainer;
        }

        /**
         *
         * @param opts {{}|HC.GuifyController}
         * @returns {HC.GuifyController}
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
            super.remove();
            this.removeChildren();
        }

        /**
         *
         * @param key
         */
        removeChild(key) {
            this.getChild(key).remove();
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
         * @returns {HC.GuifyController}
         */
        findFirstVisibleControl() {
            for (let k in this.children) {
                let child = this.getChild(k);

                if (child instanceof HC.GuifyFolder) {
                    child = child.findFirstVisibleControl();
                    if (child) {
                        return child;
                    }
                } else {
                    if (child.getVisible()) {
                        return child;
                    }
                }
            }
        }

        /**
         *
         * @param property
         * @param parent
         * @return {*|boolean|HC.GuifyFolder|boolean}
         */
        findControlByProperty(property) {

            for (let k in this.children) {
                let child = this.getChild(k);

                if (child instanceof HC.GuifyFolder) {
                    child = this.findControlByProperty(property);
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
         * @param value
         * @returns {boolean}
         */
        filterTree(value) {
            let found = false;
            let reset = value ? false : true;
            let regExp = new RegExp(value);

            for (let k in this.children) {
                let child = this.getChild(k);

                if (child instanceof HC.GuifyFolder) {
                    if (child.filterTree(value) && !reset) {
                        child.setVisible(true);
                        child.setOpen(true);
                        found = true;

                    } else {
                        child.setOpen(false);
                        child.setVisible(reset);
                    }

                } else if (!reset && regExp.test(child.getProperty())) {
                        child.setVisible(true);
                        found = true;

                } else {
                    child.setVisible(reset);
                }
            }
            this.setOpen(found);
            return found;
        }

        /**
         *
         * @return {boolean}
         */
        isExpanded() {
            return this.getComponent().open;
        }

        /**
         *
         * @param exp
         */
        setOpen(exp) {
            this.getComponent().SetOpen(exp);
        }

        /**
         *
         */
        toggle() {
            this.getComponent().Toggle();
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
         * @returns {null|*}
         */
        toggleByMnemonic(char) {
            for (let k in this.children) {
                let child = this.getChild(k);

                if (child.getMnemonic() == char) {
                    child.mnemonicAction();
                    return child;
                }
            }

            return null;
        }

        /**
         *
         */
        mnemonicAction() {
            this.setOpen(true);
        }
    }
}
