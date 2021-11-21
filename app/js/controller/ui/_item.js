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

            if (key) {
                this.getContainer().setAttribute('data-mnemonic', key)

            } else {
                this.getContainer().removeAttribute('data-mnemonic');
            }
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
         * @returns {boolean}
         */
        getVisible() {
            return this.getComponent().container.style.display !== 'none';
        }

        /**
         *
         */
        remove() {
            this.gui.Remove(this.getComponent());
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
