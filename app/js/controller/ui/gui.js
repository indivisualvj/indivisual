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
                open: open,
                search: {
                    filter: (value) => {
                        this.filterTree(value);
                    },
                    delay: 175,
                    action: (e) => {
                        let ctrl = this.findFirstVisibleControl();
                        if (ctrl) {
                            ctrl.triggerComponent();
                        }
                    }
                }
            });
            this.component = this.gui;
            if (this.gui.bar.input) {
                this.gui.bar.input.classList.add('search');
            }
            this.gui.container.style.zIndex = 99;
        }

        /**
         *
         * @param key
         * @param name
         * @param open
         * @returns {HC.GuifyFolder}
         */
        addFolder(key, name, open) {
            let folder = new HC.GuifyFolder(this.gui, null, name || key, open);
            folder.setKey(key);
            this.children[key] = folder;

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

            return display !== 'none';
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
