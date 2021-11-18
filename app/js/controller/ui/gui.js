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
         * @param title
         * @param open
         */
        constructor(id, title, open) {
            super(null, null, id, title);
        }

        /**
         *
         * @param id
         * @param title
         */
        init(id, title) {
            this.gui = new guify({
                title: title,
                theme: 'dark', // dark, light, yorha, or theme object
                align: 'right', // left, right
                width: '100%',
                barMode: 'offset', // none, overlay, above, offset
                panelMode: 'inner',
                opacity: 1,
                pollRateMS: FIVE_FPS,
                root: document.getElementById(id),
                search: {
                    filter: (value) => {
                        this.filterTree(value);
                    },
                    delay: 175,
                    action: () => {
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
                this.gui.bar.input.addEventListener('keyup', (e) => {
                    if (e.key === 'Escape') {
                        e.currentTarget.value = '';
                        this.filterTree('');
                        e.currentTarget.blur();
                    }
                });
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
            return this.gui.bar.label.textContent;
        }

        /**
         *
         * @param label
         */
        setLabel(label) {
            this.gui.bar.label.textContent = label;
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

        toggleFullscreen() {
            this.gui.ToggleFullscreen();
        }
        /**
         *
         */
        remove() {
        }

        openByPath(path) {
            let control = this.findByPath(path);
            let result = control;
            if (control) {
                do {
                    control.setOpen(true);
                } while ((control = control.getParent()));
            }

            return result;
        }

        findByPath(path) {
            let parts = path.split('/');
            let control = this;
            for (const part in parts) {
                let name = parts[part];
                if (!control.hasChild(name)) {
                    control = null;
                    break;
                }
                control = control.getChild(name);
            }

            return control;
        }
    }
}
