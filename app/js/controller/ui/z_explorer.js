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
         * @param open
         * @param {HC.Explorer} explorer
         */
        constructor(id, open, explorer) {
            super(id, open);
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
            this.getComponent().bar.input.style = 'left: unset; right: 50px;';
            let actions = document.createElement('div');
            actions.classList.add('actions');
            actions.innerHTML =
                '<div class="new"></div>' +
                '<div class="reset"></div>';
            actions.childNodes.item(0).addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                explorer.presetMan.newFolder(this);
            });
            actions.childNodes.item(1).addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                explorer.reload();
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
                    '<div class="new"></div>' +
                    '<div class="fill"></div>' +
                    '<div class="save"></div>' +
                    '<div class="rename"></div>';
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
         * @param opts
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
         * @param info
         */
        setInfo(info) {
            if (info !== null) {
                this.getComponent().label.setAttribute('data-label', info);

            } else {
                this.getComponent().label.removeAttribute('data-label');
            }
        }

        /**
         *
         * @returns {string}
         */
        getInfo() {
            return this.getComponent().label.getAttribute('data-label');
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

            let actions = document.createElement('div');
            actions.classList.add('actions');
            actions.innerHTML =
                '<div class="save"></div>' +
                '<div class="rename"></div>' +
                '<div class="delete"></div>';
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
