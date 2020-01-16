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
            if (this.getParent()) {
                this.getComponent().Remove();

                return true;
            }

            return false;
        }

        /**
         *
         * @returns {string}
         */
        getLabel() {
            return this.getComponent().opts.label;
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
