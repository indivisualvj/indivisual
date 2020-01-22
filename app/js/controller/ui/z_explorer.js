/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.GuifyExplorer}
     */
    HC.GuifyExplorer = class GuifyExplorer extends HC.Guify {
        constructor(id, open) {
            super(id, open);
        }

        /**
         *
         * @param name
         * @param open
         * @returns {HC.GuifyFolder}
         */
        addFolder(name, open) {
            let folder = new HC.GuifyExplorerFolder(this.gui, null, name, open);
            this.children[folder.getLabel()] = folder;

            return folder;
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
         */
        finishLayout(data, owner) {
            // todo add actions add/loadall/saveall/rename

            let clear = document.createElement('div');
            clear.classList.add('guify-component-container');
            clear.classList.add('clear');
            this.getFolderContainer().appendChild(clear);
        }

        /**
         *
         * @param opts
         * @param data
         * @param owner
         * @returns {HC.GuifyExplorerPreset}
         */
        addPreset(data, owner) {

            let opts = {
                type: 'button',
                label: data.name,
                loaded: data.loaded,
                layer: data.layer,
                cssClasses: 'clear',
                dataClass: 'eighty',
                action: (ctrl) => {owner.loadPreset(data, this)}
            };

            let controller = new HC.GuifyExplorerPreset(this, opts, data, owner);

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
         * @param data
         * @param owner
         */
        constructor(parent, opts, data, owner) {
            super(parent, opts);

            this.addActions(data, owner);
        }

        addActions(data, owner) {
            let opts = {
                type: 'button',
                label: '',
                cssClasses: 'save action noclear',
                dataClass: 'five',
                action: (ctrl) => {owner.savePreset(data, this)}
            };
            this.parent.addController(opts);

            opts = {
                type: 'button',
                label: '',
                cssClasses: 'rename action noclear',
                dataClass: 'five',
                action: (ctrl) => {owner.renameItem(data, this)}
            };
            this.parent.addController(opts);

            opts = {
                type: 'button',
                label: '',
                cssClasses: 'delete action noclear',
                dataClass: 'five',
                action: (ctrl) => {owner.deletePreset(data, this)}
            };
            this.parent.addController(opts);
        }
    }
}
