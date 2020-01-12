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
 * todo guify
 */
HC.Controller.prototype.initKeyboard = function () {

    var keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var setMnemonics = function (control, key) {
        key = key || control.getLabel();
        let guiKeys = statics.ControlValues.predefined_keys[key] ? statics.ControlValues.predefined_keys[key] : {};

        let gi = 0;
        if (control.children) {
            for (let k in control.children) {
                let child = control.getChild(k);;

                if (child instanceof HC.ControllerUi.Folder) {
                    if (gi < keys.length) {
                        child.folder.container.setAttribute('data-mnemonic', keys.charAt(gi++));
                    }
                    setMnemonics(child, key);

                } else {
                    let folder = child.getParent().getLabel();
                    let name = child.getProperty();

                    if (gi < keys.length) {

                        let key = null;
                        if (folder in guiKeys
                            && name in guiKeys[folder]
                        ) { // vorbelegte
                            key = guiKeys[folder][name];

                        } else {
                            key = keys.charAt(gi++);
                        }

                        child.controller.container.setAttribute('data-mnemonic', key);
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
            if (e.keyCode == 8 || e.keyCode == 27) { // BACKSPACE | ESCAPE
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
            statics.ControlSettings.reset();

        } else if (e.keyCode == 8) { // BACKSPACE = close folders
            var open = controller.nextOpenFolder();
            if (!(open instanceof HC.ControllerUi)) {
                controller.closeAll(open);
                controller.scrollToControl(open);

            } else {
                let open = controller.closeAll();
                controller.scrollToControl(open);
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
            statics.ControlSettings.push_layers();

        } else if (e.keyCode == 33) { // PG_UP = rst_shaders
            e.stopPropagation();
            e.preventDefault();
            statics.ControlSettings.rst_shaders();

        } else if (e.keyCode == 34) { // PG_DOWN = push_sources
            e.stopPropagation();
            e.preventDefault();
            statics.ControlSettings.push_sources();
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

            controller.toggleByKey(ci, e.shiftKey);
        }
    });
};