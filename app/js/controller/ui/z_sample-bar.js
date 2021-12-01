/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.SampleBar = class SampleBar extends HC.Guify {

        /**
         * @type {HC.SampleControllerUi}
         */
        ui;

        /**
         *
         * @param id
         * @param title
         * @param open
         * @param object
         * @param controller
         */
        constructor(id, title, open, object, controller) {
            super(id, title, open);

            this.ui = new HC.SampleControllerUi(object, this.gui);
            this.ui.addControllers(() => {
                controller.sequenceSettingsGui.setOpen(true);
                for (let key in controller.sequenceSettingsGui.children) {
                    controller.sequenceSettingsGui.getChild(key).setOpen(true);
                }

            }, (seq, smp) => {
                controller.updateSource(getSequenceSampleKey(seq), smp, true, true, false);
            });
            this._finishFolder(this.gui.panel.panel);

        }

        /**
         *
         * @param id
         * @param title
         */
        init(id, title) {

            this.opts = {
                title: title,
                theme: 'dark', // dark, light, yorha, or theme object
                align: 'right', // left, right
                width: '100%',
                barMode: 'offset', // none, overlay, above, offset
                panelMode: 'inner',
                opacity: 1,
                pollRateMS: SKIP_TEN_FRAMES,
                root: document.getElementById(id),
            };

            this.gui = new guify(this.opts);
            this.gui.container.style.zIndex = 99;
            this.gui.container.style.position = 'relative';
            this.gui.panel.container.style.background = '#000';

            this.setOpen(true);

        }

        getFolderContainer() {
            return this.gui.panel.panel;
        }

        _finishFolder(container) {
            let clear = document.createElement('div');
            clear.classList.add('guify-component-container');
            clear.classList.add('clear');
            container.appendChild(clear);
        }
    }
}
