/**
 *
 */
HC.Controller.prototype.initLogEvents = function () {
    var co = document.getElementById('blockfocus');
    if (co) {
        co.onclick = function (evt) {
            if (co.getAttribute('fixed')) {
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
    var keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var setMnemonics = function (control) {

        var gi = 0;
        if (control.__folders) {
            for (var k in control.__folders) {
                var v = control.__folders[k];

                if (gi < keys.length) {
                    v.domElement.parentElement.setAttribute('data-mnemonic', keys.charAt(gi++));
                }
                setMnemonics(v);
            }
        }
        if (control.__controllers && control.__controllers.length) {
            for (var k in control.__controllers) {
                var v = control.__controllers[k];
                var folder = control.name;
                var name = v.property;

                if (gi < keys.length) {

                    var key = null;
                    if (folder in statics.ControlValues._keys
                        && name in statics.ControlValues._keys[folder]
                    ) { // vorbelegte
                        key = statics.ControlValues._keys[folder][name];

                    } else {
                        key = keys.charAt(gi++);
                    }

                    v.domElement.parentElement
                        .parentElement.setAttribute('data-mnemonic', key);
                }
            }
        }
    };

    setMnemonics(controller.gui);

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

        var src = e.srcElement;
        if (src.nodeName.match(/(INPUT)/i)) {
            if (e.keyCode == 27) { // ESCAPE
                this.focus();
                src.blur();
                this.focus();
                src.blur();
                e.preventDefault();
                e.stopPropagation();

            } else if (e.keyCode == 9) { // TAB
                e.preventDefault();
                e.stopPropagation();

            } else if (e.keyCode == 38 || e.keyCode == 40) { // UP + DOWN
                var f = parseFloat(src.value);
                if (!isNaN(f)) {
                    var s = parseFloat(src.getAttribute('data-step'));
                    if (!isNaN(s)) {
                        if (e.keyCode == 40) {
                            s *= -1;
                        }
                        src.value = f + s;
                        src.blur();
                        src.focus();
                    }
                }
            }
            return;

        } else if (src.nodeName.match(/(SELECT)/i)) {
            if (e.keyCode == 8 || e.keyCode == 27) { // BACKSPACE + ESCAPE
                this.focus();
                src.blur();
                this.focus();
                src.blur();
                e.preventDefault();
                e.stopPropagation();

            }
            return;
        }

        if (e.keyCode == 32) { // SPACE = play/pause
            controller.updateControl('play', !statics.ControlSettings.play, true, true, false);

        } else if (e.keyCode == 46) { // DEL = reset
            statics.ControlController.g_controls.reset();

        } else if (e.keyCode == 8) {
            var open = controller.nextOpenFolder();
            if (open != controller.gui) {
                controller.closeAll(open.parent);

            } else {
                controller.closeAll(controller.gui);
            }
            e.preventDefault();
            e.stopPropagation();
            return;

        } else if (e.keyCode == 36) { // HOME = monitor
            e.stopPropagation();
            e.preventDefault();
            controller.updateControl('monitor', !statics.ControlSettings.monitor, true, true, false);

        } else if (e.keyCode == 35) { // END = push_layers
            e.stopPropagation();
            e.preventDefault();
            statics.ControlController.g_controls.push_layers();

        } else if (e.keyCode == 33) { // PG_UP = rst_shaders
            e.stopPropagation();
            e.preventDefault();
            statics.ControlController.g_controls.rst_shaders();

        } else if (e.keyCode == 34) { // PG_DOWN = push_sources
            e.stopPropagation();
            e.preventDefault();
            statics.ControlController.g_controls.push_sources();
        }

        if (e.keyCode in LAYER_KEYCODES) {
            var val = LAYER_KEYCODES[e.keyCode];

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

            controller.toggleByKey(ci, e.shiftKey);
        }
    });
};