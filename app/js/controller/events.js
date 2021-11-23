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

    HC.KeyEvent = class KeyEvent extends HC.Event {

        codes;

        label;

        /**
         *
         * @param type
         * @param codes
         * @param callback
         * @param label
         */
        constructor(type, codes, callback, label) {
            super(type, callback);
            this.codes = codes;
            this.label = label;
        }

        /**
         *
         */
        register(element) {
            element.addEventListener(this.type, (e) => {
                if (this.codes.includes(e.keyCode) && !(/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.nodeName))) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.callback(e);
                }
            });
        }
    };

    HC.MouseEvent = class MouseEvent extends HC.Event {

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
            this.label = label;
        }

        register(element) {
            hotkeys(this.type, (e) => {
                e.preventDefault();
                this.callback(e);
            });
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

    let keys = MNEMONICS;
    let ci = 0;
    let setMnemonics = function (control, key) {
        key = key || control.getLabel();

        if (control instanceof HC.Guify) {
            let key = keys.charAt(ci++);
            control.setMnemonic(key);
        }

        let gi = 0;
        if (control.children) {
            for (let k in control.children) {
                let child = control.getChild(k);

                if (child instanceof HC.GuifyFolder) {
                    if (!child.getMnemonic() && gi < keys.length) {
                        child.setMnemonic(keys.charAt(gi++));
                    }
                    setMnemonics(child, key);

                } else {

                    if (!child.isDisplay() && !child.getMnemonic() && gi < keys.length) {
                        let key = keys.charAt(gi++);
                        child.setMnemonic(key);
                    }
                }
            }
        }
    };

    for (const key in this.guis) {
        setMnemonics(this.guis[key]);
    }

    this._initLayerKeys();

    window.addEventListener('keyup', (e) => {
        this.config.ctrlKey = e.ctrlKey;
        this.config.altKey = e.altKey;
        this.config.shiftKey = e.shiftKey;
    });

    window.addEventListener('keydown', (e) => {

        this.config.ctrlKey = e.ctrlKey;
        this.config.altKey = e.altKey;
        this.config.shiftKey = e.shiftKey;

        if (e.ctrlKey && (e.shiftKey || e.altKey)) {
            return;
        }

        if (/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.nodeName)) {
            return;
        }

        if (e.key === 'Shift') {
            if (this.config.doubleShift) {

                let open = this.nextOpenFolder();
                if (open.gui.bar) {
                    open.gui.bar.input.focus();
                }

                clearTimeout(this.config.doubleShift);
                this.config.doubleShift = false;
            } else {
                this.config.doubleShift = setTimeout(() => {
                    this.config.doubleShift = false;
                }, 300);
            }
        }

        if (e.key === 'Backspace') { // = close folders
            let open = this.nextOpenFolder();
            if (!(open instanceof HC.Guify)) {
                this.closeAll(open);
                this.scrollToControl(open);

            } else {
                let open = this.closeAll();
                this.scrollToControl(open);
            }
            e.preventDefault();
            e.stopPropagation();
            return;

        }

        let char = String.fromCharCode(e.keyCode);
        let ci;

        if ((ci = keys.indexOf(char)) > -1) {
            e.preventDefault();
            e.stopPropagation();

            this.toggleByKey(ci, char, e.shiftKey);
        }
    });
};

HC.Controller.prototype._initLayerKeys = function () {
    let layers = Object.keys(this.config.ControlValues.layer).slice(0, 10);
    for (const key in layers) {
        let id = layers[key];
        id = key>0?parseInt(id):10;
        hotkeys(key, (e) => {
            // never when in:
            if (/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.nodeName)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let layer = id-1;

            console.log('switch layer', layer);
            this.updateControl('layer', layer, true, true);
        });
    }
    for (const key in layers) {
        let id = layers[key];
        id = key>0?parseInt(id):10;
        hotkeys('shift+' + key, (e) => {
            // never when in:
            if (/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.nodeName)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let layer = id+9;

            console.log('switch layer', layer);
            this.updateControl('layer', layer, true, true);
        });
    }
};