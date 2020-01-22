/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Explorer}
     */
    HC.Explorer = class Explorer {
        /**
         * @type {HC.Controller}
         */
        owner;

        statics;

        /**
         * @type {HC.GuifyExplorer}
         */
        gui;

        /**
         *
         * @type {Array}
         */
        default = [{
            name: '_default',
            type: 'folder',
            default: true,
            visible: true,
            children: [
                {
                    index: 0,
                    name: '_default',
                    type: 'preset',
                    default: true,
                    loaded: false,
                    layer: '',
                    changed: ''
                }
            ]
        }];

        /**
         *
         * @param owner
         * @param settings
         */
        constructor(owner, settings) {
            this.owner = owner; // todo use it!
            this.statics = settings; // todo use it!

            this.init();
            this.load();
        }

        /**
         *
         */
        init() {
            this.gui = new HC.GuifyExplorer('Presets', true);
        }

        /**
         * 
         */
        load() {
            messaging.files(STORAGE_DIR, (data) => {
                let _insert = (children, parent) => {
                    for (let k in children) {
                        let child = children[k];

                        if (child.type == 'folder') {
                            let folder = parent.addFolder(child.name, false);
                            _insert(child.children, folder);
                            folder.finishLayout(child, this.owner.presetman);

                        } else {
                            parent.addPreset(child, this.owner.presetman);

                        }
                    }
                };
                _insert(this.default, this.gui);
                _insert(data, this.gui);
            });
        }

        /**
         * 
         * @param layer
         * @param model
         */
        setPreset(layer, model) {

        }

        /**
         * 
         */
        resetPresets() {
            for (let i = 0; i < statics.ControlValues.layer.length; i++) {
                this.setPreset(i, false);
            }
        }

        /**
         * fixme wenever preset is loaded its status is set to changed by guify colorpicker
         * @param layer
         * @param changed
         */
        setChanged(layer, changed) {
            let l = cm.getLayer(layer);

        }

        /**
         * 
         * @param layer
         * @param loaded
         */
        setLoaded(layer, loaded) {

        }

        /**
         * 
         */
        resetLoaded() {

        }
    }
}
