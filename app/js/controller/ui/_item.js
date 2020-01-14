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
         * @returns {HC.GuifyFolder}
         */
        getParent() {
            return this.parent;
        }

        /**
         *
         * @param key
         */
        setMnemonic(key) {
            this.mnemonic = key.length < 2 ? key : null;
            this.component.container.setAttribute('data-mnemonic', key)
        }

        /**
         *
         * @return {*}
         */
        getMnemonic() {
            return this.mnemonic;
        }

        mnemonicAction() {
            console.log('not implemented');
        }

        /**
         *
         * @param v
         */
        setVisible(v) {
            this.setOpen(false);
            this.component.container.style.display = v ? 'block' : 'none';
        }

        /**
         *
         */
        remove() {
            if (this.getParent()) {
                this.component.Remove();

                return true;
            }

            return false;
        }

        /**
         *
         * @returns {string}
         */
        getLabel() {
            return this.component.opts.label;
        }


        /**
         *
         * @return {HTMLDivElement}
         */
        getContainer() {
            return this.component.container;
        }
    }

}
