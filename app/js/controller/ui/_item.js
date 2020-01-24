/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.GuifyItem = class GuifyItem {
        /**
         * @type {guify}
         */
        gui;

        parent;

        mnemonic;

        component;

        /**
         *
         * @param gui
         */
        constructor(gui) {
            this.gui = gui;
        }

        /**
         *
         * @returns {HC.GuifyFolder}
         */
        getParent() {
            return this.parent;
        }

        /**
         *
         * @returns {*}
         */
        getComponent() {
            return this.component;
        }

        /**
         *
         * @param key
         */
        setMnemonic(key) {
            this.mnemonic = key;
            this.getContainer().setAttribute('data-mnemonic', key)
        }

        /**
         *
         * @return {*}
         */
        getMnemonic() {
            return this.mnemonic;
        }

        /**
         *
         */
        mnemonicAction() {
            console.log('not implemented');
        }

        /**
         *
         * @param v
         */
        setVisible(v) {
            this.getComponent().container.style.display = v ? 'block' : 'none';
        }

        /**
         *
         */
        remove() {
            this.getComponent().Remove();
        }

        /**
         *
         * @returns {string}
         */
        getLabel() {
            return this.getComponent().label.textContent;
        }

        /**
         *
         * @param label
         */
        setLabel(label) {
            this.getComponent().label.textContent = label;
        }

        /**
         *
         * @returns {*}
         */
        getType() {
            return this.getComponent().opts.type;
        }

        /**
         *
         * @returns {boolean}
         */
        isDisplay() {
            return this.getType() === 'display';
        }

        /**
         *
         * @return {HTMLDivElement}
         */
        getContainer() {
            return this.getComponent().container;
        }
    }

}
