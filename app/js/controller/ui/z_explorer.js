/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.GuifyExplorer}
     */
    HC.GuifyExplorer = class GuifyExplorer extends HC.Guify {

        /**
         *
         * @param id
         * @param name
         * @param open
         * @param {HC.Explorer} explorer
         */
        constructor(id, name, open, explorer) {
            super(id, name, open);
            this.finishLayout(explorer);
        }

        /**
         *
         * @param key
         * @param name
         * @param open
         * @returns {HC.GuifyExplorerFolder}
         */
        addFolder(key, name, open) {
            let folder = new HC.GuifyExplorerFolder(this.gui, null, name || key, open);
            folder.setKey(key);
            this.children[key] = folder;

            return folder;
        }

        /**
         *
         * @param {HC.Explorer} explorer
         */
        finishLayout(explorer) {

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
                explorer.presetMan.newFolder(this);
            });
            actions.childNodes.item(1).addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                explorer.reload(() => {
                    explorer.controller.refreshLayerInfo();
                });

            });
            container.appendChild(actions);
        }
    }
}

{
    /**
     *
     * @type {HC.GuifyExplorerFolder}
     */
    HC.GuifyExplorerFolder = class GuifyExplorerFolder extends HC.GuifyFolder {

        /**
         *
         * @param data
         * @param {HC.PresetManager} presetMan
         */
        finishLayout(data, presetMan) {

            if (!data.default) {
                let container = this.getComponent().container;
                let actions = document.createElement('div');
                actions.classList.add('actions');
                actions.innerHTML =
                    '<div class="new" title="Save current layer to new file."></div>' +
                    '<div class="fill" title="Fill (shuffleable) layers with presets.\nPress SHIFT to fill remaining (shuffleable) layers."></div>' +
                    '<div class="save" title="!Attention! Save all files assigned to a layer!"></div>' +
                    '<div class="rename" title="Rename this folder."></div>';
                actions.childNodes.item(0).addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    presetMan.newPreset(this);
                });
                actions.childNodes.item(1).addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (e.shiftKey) {
                        presetMan.appendPresets(this);

                    } else {
                        presetMan.loadPresets(this);
                    }
                });
                actions.childNodes.item(2).addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    presetMan.savePresets(this);
                });
                actions.childNodes.item(3).addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    presetMan.renameItem(this);
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
         * @param data
         * @param {HC.PresetManager} presetMan
         * @returns {HC.GuifyExplorerPreset}
         */
        addPreset(data, presetMan) {

            let opts = {
                type: 'button',
                label: data.name
            };

            let controller = new HC.GuifyExplorerPreset(this, opts, presetMan);

            this.children[controller.getLabel()] = controller;

            return controller;
        }
    }
}

{
    /**
     *
     * @type {HC.GuifyExplorerPreset}
     */
    HC.GuifyExplorerPreset = class GuifyExplorerPreset extends HC.GuifyController {

        /**
         *
         * @param parent
         * @param opts
         * @param {HC.PresetManager} presetMan
         */
        constructor(parent, opts, presetMan) {

            opts.action = () => {presetMan.loadPreset(this)};

            super(parent, opts);

            if (opts.label !== '_default') {
                this.finishLayout(presetMan);
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
         * @param {HC.PresetManager} presetMan
         */
        finishLayout(presetMan) {
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
                e.preventDefault(); e.stopPropagation();
                presetMan.savePreset(this);
            });
            actions.childNodes.item(1).addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                presetMan.renameItem(this);
            });
            actions.childNodes.item(2).addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                presetMan.deletePreset(this);
            });
            container.appendChild(actions);
        }
    }
}
