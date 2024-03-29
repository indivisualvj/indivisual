/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {GuifyItem} from "./GuifyItem";
import {GuifyController} from "./GuifyController";

class GuifyFolder extends GuifyItem {

    /**
     *
     * @type {Object.<string, GuifyItem>}
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
            folder: (this.getParent() ? this.getParent().getLabel() : null),
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
     * @param key
     * @param name
     * @param open
     * @returns {GuifyFolder}
     */
    addFolder(key, name, open) {
        let folder = new GuifyFolder(this.gui, this, name || key, open);
        folder.setKey(key);
        this.children[key] = folder;

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
     * @param opts {{}|GuifyController}
     * @returns {GuifyController}
     */
    addController(opts) {

        let controller;
        if (opts instanceof GuifyController) {
            controller = opts;

        } else {
            controller = new GuifyController(this, opts);
        }

        let key = controller.getUniqueKey();
        if (key in this.children) {
            throw new Error('Duplicate entry "' + key + '"');
        }
        this.children[key] = controller;

        return controller;
    }

    /**
     *
     * @param label
     * @param property
     * @param object
     * @param options
     * @param onChange
     * @param [opts]
     * @returns {GuifyController}
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
     * @returns {GuifyItem|GuifyFolder|GuifyController}
     */
    getChild(key) {
        if (key in this.children) {
            return this.children[key];
        }

        return null;
    }

    getChildKey(child) {
        for (const childKey in this.children) {
            if (this.children[childKey] === child) {
                return childKey;
            }
        }
    }

    hasChild(key) {
        return this.children.hasOwnProperty(key);
    }

    /**
     *
     * @returns {GuifyController[]}
     */
    getAllControllers() {
        let ctrls = [];
        let _find = function (inst, ctrls) {
            for (const key in inst.children) {
                let child = inst.children[key];
                if (child instanceof GuifyFolder) {
                    _find(child, ctrls)
                } else if (child instanceof GuifyController) {
                    ctrls.push(child)
                }
            }
        }

        _find(this, ctrls);
        return ctrls;
    }

    /**
     *
     */
    remove() {
        this.removeChildren();
        super.remove();
    }

    /**
     *
     * @param key
     */
    removeChild(key) {
        let child = this.getChild(key);
        if (!child) {
            child = key;
            key = this.getChildKey(child);
        }
        child.remove();
        delete this.children[key];
    }

    /**
     *
     * @param key
     * @param label
     */
    renameChild(key, label) {
        let child = this.getChild(key);
        if (!child) {
            child = key;
            key = this.getChildKey(child);
        }
        child.setLabel(label);
        delete this.children[key];
        this.children[label] = child;
    }

    /**
     *
     */
    removeChildren() {
        for (let f in this.children) {
            this.removeChild(f);
        }
    }

    /**
     *
     * @param key
     * @param parent
     * @return {*|boolean|GuifyFolder|boolean}
     */
    findFolderByKey(key, parent) {
        parent = parent || this;

        for (let k in parent.children) {
            let child = parent.getChild(k);

            if (child instanceof GuifyFolder) {
                if (k === key) {
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
     * @returns {GuifyController}
     */
    findFirstVisibleControl() {
        for (let k in this.children) {
            let child = this.getChild(k);

            if (child instanceof GuifyFolder) {
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
     * @returns {GuifyItem|boolean}
     */
    findControlByProperty(property) {

        for (let k in this.children) {
            let child = this.getChild(k);

            if (child instanceof GuifyFolder) {
                child = child.findControlByProperty(property);
                if (child) {
                    return child;
                }
            } else {
                if (child.getProperty() === property) {
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
        let reset = !value;
        let regExp = new RegExp(value);

        for (let k in this.children) {
            let child = this.getChild(k);

            if (child instanceof GuifyFolder) {
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
            if (c instanceof GuifyFolder) {
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
            if (c instanceof GuifyController) {
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

            if (child.getMnemonic() === char) {
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

export {GuifyFolder}