/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Messaging} from "../../../lib/Messaging";
import {ControlSetUi} from "./ControlSetUi";


class ControlSetGuifyUi extends ControlSetUi {

    /**
     * @type {Guify}
     */
    gui;

    /**
     * @type {GuifyFolder}
     */
    folder;

    /**
     *
     * @param {ControlSet} controlSet
     * @param {Guify} gui
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
     * @param shareListener
     * @returns {GuifyFolder}
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
     * @protected
     */
    _styleFolder(folder, key, border) {
        let container = folder.getFolderContainer();

        container.setAttribute('data-border', border);
        container.setAttribute('data-id', key);
    }

    /**
     *
     * @param folder
     * @protected
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
        let attributes = this.controlSet.attributes[key] || false;
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

        // check if hidden
        if (types && types.length > 0) {
            if(types[types.length - 1] === 'hidden') {
                return;
            }
        }

        // shorten name by regexp
        let reg = new RegExp('^' + folder.getLabel() + '(.+)');
        let name = key.replace(reg, '$1');

        let config = {
            type: 'text',
            label: name,
            object: props,
            property: key,
            onChange: (value, ctrl) => {
                this.onChange(value, ctrl);
            },
            set: this.controlSet.className(),
            initial: props[key]
        };

        if (types[types.length - 1] === 'display') {
            config.type = 'display';
            delete config.onChange;
            delete config.object;

        } else if (typeof value == 'function') {
            config.type = 'button';
            config.action = value;
            delete config.onChange;
            delete config.property;
            delete config.object;

        } else if (typeof value == 'number' && types && types.length > 2) {
            config.type = 'range';
            let min = types[0];
            let max = types[1];
            let step = types[2];
            config.min = min;
            config.max = max;
            config.step = step;

        } else if (typeof value == 'boolean') {
            config.type = 'checkbox';

        } else if (typeof value == 'string' && value.startsWith('#')) {
            config.type = 'text';

        } else if (values) {
            config.type = 'select';
            config.options = values;
        }

        let controller = folder.addController(config);
        let container = controller.getComponent().container;

        if (styles) {
            container.setAttribute('data-class', styles[0]);

            if (styles.length > 1) {
                container.classList.add(styles[styles.length - 1]);

            } else {
                container.classList.add('noclear');
            }
        }

        if (events) {
            let e = events(this.controlSet);
            if (e instanceof HC.Event) { // fixme: exists?
                controller.setMnemonic(e.label);
                e.register(window);
            }

            /**
             * often events are assigned to button components to represent global keystrokes.
             * if style is not set, hide from user.
             */
            if (!styles) {
                container.setAttribute('data-class', 'hidden');
            }
        }

        if (attributes) {
            let container = controller.getContainer()
            for (const attributesKey in attributes) {
                container.setAttribute(attributesKey, attributes[attributesKey]);
            }
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

        Messaging.program.updateSetting(undefined, data, true, true, false);

        HC.log(set + '/' + that.getProperty(), value);

    }
}

export {ControlSetGuifyUi}
