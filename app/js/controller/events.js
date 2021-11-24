/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.Event = class Event {

        /**
         * @type {string}
         */
        type;

        /**
         * @type {function}
         */
        callback;

        /**
         *
         * @param type
         * @param callback
         */
        constructor(type, callback) {
            this.type = type;
            this.callback = callback;
        }

        /**
         *
         * @param element
         */
        register(element) {
            element.addEventListener(this.type, this.callback);
        }
    };

    HC.Hotkey = class Hotkey extends HC.Event {

        label;

        /**
         *
         * @param type
         * @param callback
         * @param label
         */
        constructor(type, callback, label) {
            super(type, callback);
            this.label = label || type;
        }

        register(element) {
            HC.Hotkey.add(this.type, (e) => {
                e.preventDefault();
                this.callback(e);
            });
        }

        static add() {
            if (hotkeys) {
                hotkeys(...arguments);
            }
        }

        static isPressed() {
            if (hotkeys) {
                return hotkeys.isPressed(...arguments);
            }
        }
    };

}


/**
 *
 */
HC.Controller.prototype.initLogEvents = function () {
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
HC.Controller.prototype.initKeyboard = function () {

    this._initMnemonics();
    this._initLayerKeys();

    HC.Hotkey.add('*', (e) => {
        if (e.key === 'Shift') {
            this._onShift(e);
        } else if (e.key === 'Backspace') {
            this._onBackspace(e);
        }
    });
};

HC.Controller.prototype._onShift = function (e) {
    if (e.ctrlKey || e.altKey) {
        return;
    }
    let key = 'HC.Controller._initDoubleShift';
    let timeoutManager = HC.TimeoutManager.getInstance();

    if (timeoutManager.has(key)) {
        let open = this.nextOpenFolder();
        if (open.gui.bar) {
            open.gui.bar.input.focus();
        }
        timeoutManager.delete(key);

    } else {
        timeoutManager.add(key, 300, () => {
        });
    }
};

/**
 *
 * @private
 */
HC.Controller.prototype._initMnemonics = function () {
    let ci = 0;
    let setMnemonics = function (control, key) {
        key = key || control.getLabel();

        if (control instanceof HC.Guify) {
            let key = MNEMONICS.charAt(ci++);
            control.setMnemonic(key);
        }

        let gi = 0;
        if (control.children) {
            for (let k in control.children) {
                let child = control.getChild(k);

                if (child instanceof HC.GuifyFolder) {
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
            console.log(char);
            if (e.ctrlKey || e.altKey) {
                return;
            }
            e.preventDefault();

            this.toggleByKey(ci, char, e.shiftKey);
        });
    }
};

HC.Controller.prototype._onBackspace = function (e) {
    if (e.shiftKey || e.altKey || e.ctrlKey) {
        return;
    }

    let open = this.nextOpenFolder();
    if (!(open instanceof HC.Guify)) {
        this.closeAll(open);
        this.scrollToControl(open);

    } else {
        let open = this.closeAll();
        this.scrollToControl(open);
    }
    e.preventDefault();
};

/**
 *
 * @private
 */
HC.Controller.prototype._initLayerKeys = function () {
    let layers = Object.keys(this.config.ControlValues.layer).slice(0, 10);
    for (const key in layers) {
        let id = layers[key];
        id = key>0?parseInt(id):10;

        HC.Hotkey.add(key, (e) => {
            e.preventDefault();
            let layer = id-1;

            this.updateControl('layer', layer, true, true);
        });
    }
    for (const key in layers) {
        let id = layers[key];
        id = key>0?parseInt(id):10;

        HC.Hotkey.add('shift+' + key, (e) => {
            // never when in:
            if (this._isTargetInput(e)) {
                return;
            }
            e.preventDefault();
            let layer = id+9;

            this.updateControl('layer', layer, true, true);
        });
    }
};