/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Guify} from "./guify/Guify";
import {GuifyController} from "./guify/GuifyController";
import {GuifyFolder} from "./guify/GuifyFolder";

class PresetUi extends Guify {

    /**
     *
     * @param id
     * @param name
     * @param open
     * @param opts
     */
    constructor(id, name, open, opts) {
        super(id, name, open);
        this.finishLayout(opts);
    }

    /**
     *
     * @param {string}key
     * @param {string}name
     * @param {boolean}open
     * @returns {Folder}
     */
    addFolder(key, name, open) {
        let folder = new Folder(this.gui, null, name || key, open);
        folder.setKey(key);
        folder.setParent(this);
        this.children[key] = folder;

        return folder;
    }

    /**
     *
     * @param layer
     */
    resetLayerStatus(layer) {
        let ctrls = this.getContainer().querySelectorAll('[data-label="' + (layer) + '"]');
        ctrls.forEach((ctrl) => {
            ctrl.removeAttribute('data-label');
            ctrl.removeAttribute('data-mnemonic');
            ctrl.removeAttribute('data-selected');
        });
    }

    /**
     *
     * @param layer
     * @param changed
     */
    setChanged(layer, changed) {
        let ctrls = this.getContainer().querySelectorAll('[data-label="' + (layer) + '"]');
        ctrls.forEach((ctrl) => {
            ctrl.setAttribute('data-mnemonic', changed ? '!' : null);
        });
    }

    /**
     *
     * @param path
     * @param layer
     */
    setInfoByPath(path, layer) {
        let control = this.findByPath(path);
        if (control) {
            control.setInfo(layer);
        }
    }


    /**
     *
     * @param layer
     * @param loaded
     */
    setSelected(layer, loaded) {
        let ctrls = this.getContainer().querySelectorAll('[data-selected]');
        ctrls.forEach((ctrl) => {
            ctrl.removeAttribute('data-selected');
        });

        ctrls = this.getContainer().querySelectorAll('[data-label="' + (layer) + '"]');
        ctrls.forEach((ctrl) => {
            ctrl.setAttribute('data-selected', loaded ? 'true' : null);
        });
    }

    /**
     *
     * @param {string}label
     * @param {Folder}parent
     * @param opts
     */
    addPreset(label, parent, opts) {
        opts.type = 'button';
        opts.label = label;

        parent.addPreset(opts);
    }

    /**
     *
     * @param opts
     */
    finishLayout(opts) {

        let container = this.getComponent().bar.element;
        if (this.getComponent().bar.input) {
            this.getComponent().bar.input.style = 'left: unset; right: 50px;';
        }
        let actions = document.createElement('div');
        actions.classList.add('actions');
        actions.innerHTML =
            '<div class="new" title="Create folder."></div>' +
            '<div class="reset" title="Reload presets."></div>';
        actions.childNodes.item(0).addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            opts.create();
        });
        actions.childNodes.item(1).addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            opts.reload();

        });
        container.appendChild(actions);
    }
}

class Folder extends GuifyFolder {

    /**
     *
     * @param {{}|null}opts
     */
    finishLayout(opts) {

        if (opts) {
            let container = this.getContainer();
            let folderContainer = this.getFolderContainer()
            folderContainer.classList.add('folder');

            let actions = document.createElement('div');
            actions.classList.add('actions');
            actions.innerHTML =
                '<div class="new" title="Save current layer to new file."></div>' +
                '<div class="fill" title="Slowly fill (shuffleable) layers with the underlying presets.\nPress SHIFT to fill remaining (shuffleable) layers."></div>' +
                '<div class="save" title="!Attention! Save all files assigned to a layer!"></div>' +
                '<div class="rename" title="Rename this folder."></div>' +
                '<div class="delete" title="Trash this file (Remains as .' + this.getLabel() + ')."></div>';
            actions.childNodes.item(0).addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                opts.create(this);
            });
            actions.childNodes.item(1).addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                opts.fill(this);
            });
            actions.childNodes.item(2).addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                opts.save(this);
            });
            actions.childNodes.item(3).addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                opts.rename(this);
            });
            actions.childNodes.item(4).addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                opts.delete(this);
            });
            container.appendChild(actions);
        }

        let clear = document.createElement('div');
        clear.classList.add('guify-component-container');
        clear.classList.add('clear');
        this.getFolderContainer().appendChild(clear);
    }

    /**
     *
     * @param opts
     * @returns {Preset}
     */
    addPreset(opts) {
        let controller = new Preset(this, opts);
        this.children[controller.getLabel()] = controller;

        return controller;
    }

    /**
     *
     * @param parent {GuifyItem}
     */
    setParent(parent) {
        this.parent = parent;
    }
}

class Preset extends GuifyController {

    /**
     *
     * @param parent
     * @param opts
     */
    constructor(parent, opts) {

        let action = opts.action;
        opts.action = () => {
            action(this);
        };

        super(parent, opts);

        if (opts.label !== '_default') {
            this.finishLayout(opts);
        }
    }

    /**
     *
     * @param selected
     */
    setSelected(selected) {
        if (selected) {
            this.getComponent().label.setAttribute('data-selected', selected);

        } else {
            this.getComponent().label.removeAttribute('data-selected');
        }
    }

    /**
     *
     * @param info
     */
    setChanged(info) {
        if (info !== null) {
            this.getComponent().label.setAttribute('data-mnemonic', info);

        } else {
            this.getComponent().label.removeAttribute('data-mnemonic');
        }
    }

    /**
     *
     * @returns {string}
     */
    getChanged() {
        return this.getComponent().label.getAttribute('data-mnemonic');
    }

    /**
     *
     * @param opts
     */
    finishLayout(opts) {
        let container = this.getContainer();
        container.classList.add('preset');
        container.setAttribute('title', 'Press CTRL to append shader passes from this preset to all loaded (shuffleable) presets')

        let actions = document.createElement('div');
        actions.classList.add('actions');
        actions.innerHTML =
            '<div class="save" title="!Attention! the current layer settings will be written to this file!"></div>' +
            '<div class="rename" title="Rename this file."></div>' +
            '<div class="delete" title="Trash this file (Remains as .' + this.getLabel() + ')."></div>';
        actions.childNodes.item(0).addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            opts.save(this);
        });
        actions.childNodes.item(1).addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            opts.rename(this);
        });
        actions.childNodes.item(2).addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            opts.delete(this);
        });
        container.appendChild(actions);
    }
}

export {PresetUi}