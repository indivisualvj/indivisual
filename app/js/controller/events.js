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
                if (this.codes.includes(e.keyCode)) {
                    e.preventDefault(); // fixme eg. pgdown scrolls. no prevent... :(
                    e.stopPropagation();
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
    var expandables = document.getElementsByClassName('expandable');

    for (var c = 0; c < expandables.length; c++) {
        var co = expandables[c];
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

        if (control instanceof HC.GuifyGui) {
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

                    if (!child.getMnemonic() && gi < keys.length) {
                        let key = keys.charAt(gi++);
                        child.setMnemonic(key);
                    }
                }
            }
        }
    };

    setMnemonics(controller.controlSettingsGui);
    setMnemonics(controller.displaySettingsGui);
    setMnemonics(controller.sourceSettingsGui);
    setMnemonics(controller.animationSettingsGui);

    window.addEventListener('keyup', function (e) {
        statics.ctrlKey = e.ctrlKey;
        statics.altKey = e.altKey;
        statics.shiftKey = e.shiftKey;
    });

    window.addEventListener('keydown', function (e) {

        statics.ctrlKey = e.ctrlKey;
        statics.altKey = e.altKey;
        statics.shiftKey = e.shiftKey;

        if (e.ctrlKey && (e.shiftKey || e.altKey)) {
            return;
        }

        if (e.keyCode == 8) { // BACKSPACE = close folders
            var open = controller.nextOpenFolder();
            if (!(open instanceof HC.GuifyGui)) {
                controller.closeAll(open);
                controller.scrollToControl(open);

            } else {
                let open = controller.closeAll();
                controller.scrollToControl(open);
            }
            e.preventDefault();
            e.stopPropagation();
            return;

        }

        if (e.keyCode in statics.ControlValues.layer_keycodes) {
            var val = statics.ControlValues.layer_keycodes[e.keyCode];

            if (e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
                val += 10;
            }

            controller.updateControl('layer', val, true, true);
            return;
        }

        var char = String.fromCharCode(e.keyCode);
        var ci;

        if ((ci = keys.indexOf(char)) > -1) {
            e.preventDefault();
            e.stopPropagation();

            controller.toggleByKey(ci, char, e.shiftKey);
        }
    });
};
