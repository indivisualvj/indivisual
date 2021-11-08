/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Event}
     */
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

    /**
     *
     * @type {HC.KeyEvent}
     */
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

    /**
     *
     * @type {HC.MouseEvent}
     */
    HC.MouseEvent = class MouseEvent extends HC.Event {

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

    setMnemonics(this.controlSettingsGui);
    setMnemonics(this.displaySettingsGui);
    setMnemonics(this.sourceSettingsGui);
    setMnemonics(this.animationSettingsGui);
    setMnemonics(this.sequenceSettingsGui);

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

        if (e.keyCode in this.config.ControlValues.layer_keycodes) {
            let val = this.config.ControlValues.layer_keycodes[e.keyCode];

            if (e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
                val += 10;
            }

            this.updateControl('layer', val, true, true);
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
