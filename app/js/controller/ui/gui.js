/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Guify}
     */
    HC.Guify = class Guify extends HC.GuifyFolder {

        /**
         *
         * @param id
         * @param open
         */
        constructor(id, open) {
            super(null, null, id, open);
        }

        /**
         *
         * @param name
         * @param open
         */
        init(name, open) {
            this.gui = new guify({
                title: name,
                theme: 'dark', // dark, light, yorha, or theme object
                align: 'right', // left, right
                width: '100%',
                barMode: 'offset', // none, overlay, above, offset
                panelMode: 'inner',
                opacity: 1,
                root: document.getElementById(name),
                open: open
            });
            this.component = this.gui;

            this.gui.container.style.zIndex = 99;
        }

        /**
         *
         * @param name
         * @param open
         * @returns {HC.GuifyFolder}
         */
        addFolder(name, open) {
            let folder = new HC.GuifyFolder(this.gui, null, name, open);
            this.children[folder.getLabel()] = folder;

            return folder;
        }

        /**
         *
         * @returns {string}
         */
        getLabel() {
            return this.gui.bar.element.textContent;
        }

        /**
         *
         * @param label
         */
        setLabel(label) {
            this.gui.bar.element.textContent = label;
        }

        /**
         *
         * @return {boolean}
         */
        isExpanded() {
            let style = window.getComputedStyle(this.gui.panel.panel);
            let display = style.getPropertyValue('display');

            return display != 'none';
        }

        /**
         *
         * @param exp
         */
        setOpen(exp) {
            this.gui.panel.SetVisible(exp);
        }

        /**
         *
         */
        remove() {
        }
    }
}
