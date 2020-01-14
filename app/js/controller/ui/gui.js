/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.GuifyGui}
     */
    HC.GuifyGui = class ControllerUi extends HC.GuifyFolder {

        /**
         *
         * @param id
         * @param open
         */
        constructor(id, open) {
            super();
            this.gui = new guify({
                title: id,
                theme: 'dark', // dark, light, yorha, or theme object
                align: 'right', // left, right
                width: '100%',
                barMode: 'offset', // none, overlay, above, offset
                panelMode: 'inner',
                opacity: 1,
                root: document.getElementById(id),
                open: open
            });
            this.component = this.gui;

            this.gui.container.style.zIndex = 998;
        }

        /**
         *
         * @returns {string}
         */
        getLabel() {
            return this.gui.opts.title;
        }

        /**
         *
         * @return {null}
         */
        getParent() {
            return null;
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
    }
}
