/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_Controller} from "./UiController";


class Controller extends _Controller {

    initEvents() {

        this._initKeyboard();
        this._initLogEvents();
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    _initLogEvents() {
        let expandables = document.getElementsByClassName('expandable');

        for (let c = 0; c < expandables.length; c++) {
            let co = expandables[c];
            co.onclick = function (evt, close) {
                if (close || co.getAttribute('fixed')) {
                    co.removeAttribute('fixed');

                } else {
                    co.setAttribute('fixed', true);
                }
            }
        }
    };

    /**
     *
     */
    _initKeyboard() {

        this._initMnemonics();
        this._initLayerKeys();

        HC.Hotkey.add('*', (e) => {
            if (e.key === 'Shift') {
                this._onShift(e);
            } else if (e.key === 'Backspace') {
                this._onBackspace(e);
            }
        });
    }

    _onShift = function (e) {
        if (e.ctrlKey || e.altKey) {
            return;
        }
        let key = 'Controller._initDoubleShift';
        if (TimeoutManager.has(key)) {
            let open = this.nextOpenFolder();
            if (open.gui.bar) {
                open.gui.bar.input.focus();
            }
            TimeoutManager.delete(key);

        } else {
            TimeoutManager.add(key, 300, () => {
            });
        }
    }

    /**
     *
     * @private
     */
    _initMnemonics() {
        let ci = 0;
        let setMnemonics = function (control, key) {
            key = key || control.getLabel();

            if (control instanceof Guify) {
                let key = MNEMONICS.charAt(ci++);
                control.setMnemonic(key);
            }

            let gi = 0;
            if (control.children) {
                for (let k in control.children) {
                    let child = control.getChild(k);

                    if (child instanceof GuifyFolder) {
                        if (!child.getMnemonic() && gi < MNEMONICS.length) {
                            child.setMnemonic(MNEMONICS.charAt(gi++));
                        }
                        setMnemonics(child, key);

                    } else {

                        if (!child.isDisplay() && !child.getMnemonic() && gi < MNEMONICS.length) {
                            let key = MNEMONICS.charAt(gi++);
                            child.setMnemonic(key);
                        }
                    }
                }
            }
        };

        for (let key in this.guis) {
            setMnemonics(this.guis[key]);
        }

        for (let ci = 0; ci < MNEMONICS.length; ci++) {
            let char = MNEMONICS[ci];
            HC.Hotkey.add(char + ',shift+' + char, (e, h) => {
                if (e.ctrlKey || e.altKey) {
                    return;
                }
                e.preventDefault();

                this.toggleByKey(ci, char, e.shiftKey);
            });
        }
    };

    _onBackspace(e) {
        if (e.shiftKey || e.altKey || e.ctrlKey) {
            return;
        }

        let open = this.nextOpenFolder();
        if (!(open instanceof Guify)) {
            this.closeAll(open);
            this.scrollToControl(open);

        } else {
            let open = this.closeAll();
            this.scrollToControl(open);
        }
        e.preventDefault();
    }

    _initLayerKeys() {
        let layers = Object.keys(this.config.ControlValues.layer).slice(0, 10);
        for (const key in layers) {
            let id = layers[key];
            id = key > 0 ? parseInt(id) : 10;

            HC.Hotkey.add(key, (e) => {
                e.preventDefault();
                let layer = id - 1;

                this.updateControl('layer', layer, true, true);
            });
        }
        for (const key in layers) {
            let id = layers[key];
            id = key > 0 ? parseInt(id) : 10;

            HC.Hotkey.add('shift+' + key, (e) => {
                e.preventDefault();
                let layer = id + 9;

                this.updateControl('layer', layer, true, true);
            });
        }
    }

    onResize() {
        let columns = document.querySelectorAll('.left');
        let allover = document.body.clientHeight - 20;

        for (let i = 0; i < columns.length; i++) {
            let col = columns[i];

            // calcuclate heights of FH elements to figure out the rest
            let cells = col.querySelectorAll('.item.fh');
            let reserved = 0;
            let ii = 0;

            for (ii = 0; ii < cells.length; ii++) {
                reserved += cells[ii].clientHeight;
            }

            let spare = allover - reserved;

            cells = col.querySelectorAll('.item:not(.fh)');
            let cc = cells.length;

            for (ii = 0; ii < cells.length; ii++) {
                cells[ii].style.height = (spare / cc) + 'px';
            }
        }
    }
}

export {Controller}