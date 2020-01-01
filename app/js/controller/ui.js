{
    /**
     *
     * @type {HC.Controller.ShaderController}
     */
    HC.Controller.ShaderController = class ShaderController {

        name;

        constructor(name) {
            this.name = name;
        }

        /**
         *
         * @param v
         */
        onChange(v) {
            controller.updateSetting(
                statics.ControlSettings.layer,
                'shaders',
                statics.AnimationSettings.shaders,
                true,
                true,
                false
            );

            HC.log(this.__gui.name + '/' + this.property, v);
        }

        getInitialSettings() {
            return statics.ShaderSettings.initial[this.name];
        }
    }
}

{
    /**
     *
     * @type {HC.Controller.ShaderPassController}
     */
    HC.Controller.ShaderPassController = class ShaderPassController extends HC.Controller.ShaderController {

        shader;

        init(shader) {
            let name = this.name;
            shader = shader || JSON.copy(statics.ShaderSettings[name]);
            shader.apply = true;
            this.setShader(shader);
        }

        /**
         *
         * @returns {*}
         */
        getShader() {
            return this.shader;
        }

        /**
         *
         * @param sh
         */
        setShader(sh) {
            this.shader = sh;
        }

        /**
         *
         * @param v
         */
        onChange(v) {

            // shaderPassControllers are added/removed in updateUiPasses
            controller.updateSetting(
                statics.ControlSettings.layer,
                'passes',
                statics.AnimationSettings.passes,
                true,
                true,
                false
            );

            let name = this.__gui.name;

            if (this.property == 'apply' && v === false) {
                // HC.Settings.update can't delete missing settings. so delete them here...
                controller.cleanShaderPasses();
                controller.updateUiPasses();
            }

            HC.log(name + '/' + this.property, v);
        }

        static onPasses(v) {

            if (v in statics.Passes) {
                let name = statics.Passes[v];
                let ctrl = new HC.Controller.ShaderPassController(name);
                ctrl.init();

                controller.addShaderPass(
                    statics.ControlSettings.layer,
                    ctrl
                );
            }
        }
    }
}


/**
 *
 * @param actions
 */
HC.Controller.prototype.addAnimationControllers = function (controlsets) {

    for (let cs in controlsets) {
        let set = controlsets[cs];
        if (set.visible !== false) {
            let ui = new HC.ControlSetUi(set);
            ui.addFolder(this.gui);
            ui.addControls();
        }
    }
};

/**
 *
 * @param controllers
 * @param settings
 * @param values
 * @param types
 * @param submit
 * @param actions
 */
HC.Controller.prototype.addControllers = function (controllers, settings, values, types, submit, actions) {

    for (var key in controllers) {
        var dir = controller.gui.addFolder(key);
        dir.__ul.parentNode.parentNode.setAttribute('data-id', key);

        if (actions) {
            this._addShareListener(key, dir, false);
        }

        for (var ksub in controllers[key]) {
            var options = controllers[key];
            if (options[ksub]
                && typeof options[ksub] == 'object'
                && (ksub.match(/^_.+/))
            ) {
                options = options[ksub];
                var _dir = dir.addFolder(ksub);
                _dir.__ul.parentNode.parentNode.setAttribute('data-id', ksub);
                _dir.__ul.parentNode.parentNode.setAttribute('data-parent', key);

                for (var _ksub in options) {
                    var ctl = this._addControl(options, settings, values, types, _ksub, _dir, submit, ksub.substr(1) + '_');
                    if (ctl) {
                        ctl.__li.setAttribute('data-parent', ksub);
                    }
                }

            } else {
                var ctl = this._addControl(options, settings, values, types, ksub, dir, submit, key + '_');
                if (ctl) {
                    ctl.__li.setAttribute('data-parent', key);
                }
            }
        }

    }
};

/**
 *
 * @param options
 * @param settings
 * @param values
 * @param types
 * @param ksub
 * @param dir
 * @param submit
 * @param removePrefix
 * @returns {*}
 * @private
 */
HC.Controller.prototype._addControl = function (options, settings, values, types, ksub, dir, submit, removePrefix) {
    var vsub = options[ksub];

    if (vsub === null) {
        return; // not visible

    } else if (ksub == 'open') {
        dir.open();

        return false; // prevent fucking it up later
    }

    var ctl = false;

    if (typeof vsub == 'function') {

        settings[ksub] = vsub;

        ctl = dir.add(settings, ksub);
        if (removePrefix) {
            var reg = new RegExp('^' + removePrefix);
            ctl.name(ksub.replace(reg, ''));
        }
        if (ksub in types) {
            var bnd = types[ksub];
            if (!bnd || bnd.length < 1) {
                console.log('error in ' + ksub);
            } else {
                ctl.__li.setAttribute('data-class', bnd[0]);
            }
        }

        ctl.__li.setAttribute('data-id', ksub);

        return ctl; // prevent fucking it up later

    } else if (ksub in values) { // dropdown

        var vls = values[ksub];
        if (typeof vls == 'object') {
            ctl = dir.add(settings, ksub, vls);

        }
        //else if (typeof vls == 'boolean') {
        //ctl = dir.add(settings, ksub);
        //}

    } else {
        if (typeof vsub == 'number') {
            if (ksub in types) {
                var bnd = types[ksub];
                var min = bnd[0];
                var max = bnd[1];
                var step = bnd[2];

                ctl = dir.add(settings, ksub, min, max, step);
                var el = ctl.domElement.getElementsByTagName('input')[0];
                el.setAttribute('data-step', step);
            }
        }
    }

    if (!ctl) {
        ctl = dir.add(settings, ksub);
    }

    if (ctl) {

        if (removePrefix) {
            // pattern_padding_oscillate -> oscillate
            // rotation_x_random -> random
            var reg = new RegExp('\\w+_([^_]+)$');
            var _ksub = ksub.replace(reg, '$1');
            ctl.name(_ksub);
            //ctl.name(ksub);
        }
        if (ksub.match(/[^0-9]+\d+_.+/)) {
            ctl.name(ksub.replace(/[^0-9]+(\d+_.+)/, '$1'));
        }

        if (ksub in types) {
            var bnd = types[ksub];
            if (!bnd || bnd.length < 1) {
                console.log('error in ' + ksub);
            } else {
                ctl.__li.setAttribute('data-class', bnd[bnd.length - 1]);
            }
        }

        ctl.__li.setAttribute('data-id', ksub);

        if (ctl instanceof dat.controllers.NumberControllerBox
            || ctl instanceof dat.controllers.NumberControllerSlider
        ) {
            ctl.onChange(submit);
        } else {
            ctl.onFinishChange(submit);
        }

        ctl._parent = dir;
    }

    return ctl;
};

/**
 *
 * @param key
 * @param dir
 * @param datasource
 * @private
 */
HC.Controller.prototype._addShareListener = function (key, dir, datasource) {
    var ul = dir.__ul;
    var li = ul.lastChild;
    var ac = document.createElement('div');
    ac.setAttribute('class', 'actions');

    var sy = document.createElement('div');
    sy.setAttribute('class', 'sync');

    sy.addEventListener('click', function () {

        if (sy.classList.contains('selected')) {
            controller.setSynchronized(key, false);
            sy.setAttribute('class', 'sync');

        } else {
            controller.setSynchronized(key, true);
            sy.setAttribute('class', 'sync selected');
        }

        dir.closed = !dir.closed; // no toggle folder tweak
    });

    ac.appendChild(sy);

    var sh = document.createElement('div');
    sh.setAttribute('class', 'share');

    sh.addEventListener('click', function () {
        // share to all layers
        controller.shareSettings(key, datasource);
        dir.closed = !dir.closed;  // no toggle folder tweak
    });

    ac.appendChild(sh);

    li.appendChild(ac);
};

/**
 *
 * @returns {*|dat.gui.GUI}
 */
HC.Controller.prototype.addShaderControllers = function () {

    var dir = controller.gui.addFolder('shaders');
    this._addShareListener('shaders', dir, true);

    for (var key in statics.ShaderSettings.initial) {
        this.addShaderControllerByKey(key, dir);
    }

    return dir;
};

/**
 *
 * @param submit
 * @returns {*|dat.gui.GUI}
 */
HC.Controller.prototype.addShaderPassControllers = function (submit) {

    if (controller._passes) {
        controller.gui.removeFolder(controller._passes.name);
    }
    let dir = controller.gui.addFolder('passes');
    controller._passes = dir;
    this._addShareListener('passes', dir, true);

    let ctl = dir.add({pass: ''}, 'pass', statics.Passes);
    ctl.onFinishChange(submit);

    return dir;
};


/**
 *
 * @param key
 * @param dir
 */
HC.Controller.prototype.addShaderControllerByKey = function (key, dir) {
    if (key in statics.ShaderSettings.initial) {
        var sh = statics.ShaderSettings[key];
        if (sh) {
            var folder = dir.addFolder(key);
            this.addShaderController(folder, false, sh, key);
        }
    }
};


/**
 *
 * @param controller
 * @param parent
 */
HC.Controller.prototype.addShaderPassController = function (controller, parent) {
    let folder = parent.addFolder(controller.name); // todo numerate passes by count
    let sh = controller.getShader();
    this.addShaderController(folder, false, sh, controller.name, controller);
};


/**
 *
 * @param folder
 * @param key
 * @param sh
 * @param parent
 * @param controller
 */
HC.Controller.prototype.addShaderController = function (folder, key, sh, parent, controller) {

    controller = controller || new HC.Controller.ShaderController(parent);
    let shi = controller.getInitialSettings() || {}; // fallback 4 cleaned settings from storage
    let submit = controller.onChange;

    for (var skey in sh) {
        var shs = sh[skey];
        var shis = shi[skey] || {};

        var ctl = false;
        var label = skey;

        if (typeof shs == 'boolean') { // apply, etc.
            ctl = folder.add(sh, skey)
                .onFinishChange(submit);

            if (skey in statics.ShaderTypes) {
                var bnd = statics.ShaderTypes[skey];
                ctl.__li.setAttribute('data-class', bnd[0]);
            }

        } else if (typeof shs == 'number') {
            ctl = folder.add(sh, skey, 0)
                .onFinishChange(submit);
            ctl.step(1);

            var el = ctl.domElement.getElementsByTagName('input')[0];
            el.setAttribute('data-step', 1);

            if (skey in statics.ShaderTypes) {
                var bnd = statics.ShaderTypes[skey];
                ctl.__li.setAttribute('data-class', bnd[0]);
            }

        } else {
            var v = ('value' in shs) ? shs['value'] : null;

            if (v !== null) {
                var b = ('_type' in shs) ? shs['_type'] : (('_type' in shis) ? shis['_type'] : null);
                var a = ('audio' in shs) ? shs['audio'] : null;
                var s = ('stepwise' in shs) ? shs['stepwise'] : null;
                var o = ('oscillate' in shs) ? shs['oscillate'] : null;

                label = (key ? (key + '_') : '') + skey;
                var min, max, step;
                if (b) {
                    min = b[0];
                    max = b[1];
                    step = b[2];

                    ctl = folder.add(shs, 'value', min, max, step)
                        .name(label)
                        .onChange(submit)
                        .onFinishChange(submit);

                    var el = ctl.domElement.getElementsByTagName('input')[0];
                    el.setAttribute('data-step', step);

                } else {
                    ctl = folder.add(shs, 'value')
                        .name(label)
                        .onFinishChange(submit);
                }

                if (a !== null) {
                    var _label = skey + '_audio';
                    ctl = folder.add(shs, 'audio')
                        .name(_label)
                        .onFinishChange(submit);
                    ctl.parent = parent;
                    ctl.label = _label;

                    if (_label) {
                        var suffix = _label.replace(/^.+_/, '_');
                        if (suffix in statics.ShaderTypes) {
                            var bnd = statics.ShaderTypes[suffix];
                            ctl.__li.setAttribute('data-class', bnd[0]);
                        }
                    }
                }

                if (s !== null) {
                    var _label = skey + '_stepwise';
                    ctl = folder.add(shs, 'stepwise')
                        .name(_label)
                        .onFinishChange(submit);
                    ctl.parent = parent;
                    ctl.label = _label;

                    if (_label) {
                        var suffix = _label.replace(/^.+_/, '_');
                        if (suffix in statics.ShaderTypes) {
                            var bnd = statics.ShaderTypes[suffix];
                            ctl.__li.setAttribute('data-class', bnd[0]);
                        }
                    }
                }

                if (o !== null) {
                    var _label = skey + '_oscillate';
                    ctl = folder.add(shs, 'oscillate', statics.ShaderValues.oscillate)
                        .name(_label)
                        .onFinishChange(submit);
                    ctl.parent = parent;
                    ctl.label = _label;

                    if (_label) {
                        var suffix = _label.replace(/^.+_/, '_');
                        if (suffix in statics.ShaderTypes) {
                            var bnd = statics.ShaderTypes[suffix];
                            ctl.__li.setAttribute('data-class', bnd[0]);
                        }
                    }
                }

            } else { // go deeper
                this.addShaderController(folder, skey, shs, parent, controller);
            }
        }

        if (ctl) {
            ctl._parent = folder;
            ctl.__controller = controller;
        }
    }
};

/**
 *
 * @param control
 * @returns {*}
 */
HC.Controller.prototype.nextOpenFolder = function (control) {

    if (!control) {
        control = this.gui;
    }

    if (control.__folders) {
        for (var k in control.__folders) {
            var v = control.__folders[k];
            if (!v.closed) {
                control = this.nextOpenFolder(v);
                break;
            }
        }
    }
    return control;
};

/**
 *
 * @param name
 */
HC.Controller.prototype.toggleByName = function (name) {
    // todo für tutorials und öffnen von shaders
};

/**
 *
 * @param property
 */
HC.Controller.prototype.toggleByProperty = function (property) {
    var control = this.getControlParentByProperty(property);
    control.open();
    this.scrollToControl(control);
};

/**
 *
 * @param property
 * @param [control]
 * @returns {*}
 */
HC.Controller.prototype.getControlParentByProperty = function (property, control) {

    control = control || this.gui;

    for (var c in control.__controllers) {
        var co = control.__controllers[c];
        if (co.property == property) {
            // found
            return control;
        }
    }
    for (var k in control.__folders) {
        var v = control.__folders[k];

        var c = this.getControlParentByProperty(property, v);
        if (c) {
            return c;
        }
    }
    return false;
};

/**
 *
 * @param item
 * @param value
 */
HC.Controller.prototype.explainPlugin = function (item, value, tree) {

    tree = tree || HC.plugins;

    if (item in tree) {
        if (value in tree[item]) {
            var proto = tree[item][value];
            var desc = proto.tutorial;
            if (desc) {
                var key = item + '.' + value;
                new HC.ScriptProcessor(key, desc).log();
            }
        }
    }
};

/**
 *
 * @param control
 */
HC.Controller.prototype.closeAll = function (control) {

    control = control || this.gui;

    if (control.__folders) {
        for (var k in control.__folders) {
            var v = control.__folders[k];
            v.close();
            this.closeAll(v);
        }
    }
};

/**
 *
 * @param ci
 * @param shiftKey
 */
HC.Controller.prototype.toggleByKey = function (ci, shiftKey) {
    var open = this.nextOpenFolder(this.gui);
    var folderKeys = [];
    if (open.__folders) {
        folderKeys = Object.keys(open.__folders);
    }

    var controllerKeys = [];
    if (open.__controllers) {
        controllerKeys = Object.keys(open.__controllers);

        if (shiftKey && controllerKeys.length > 0) { // reset on shift
            this.resetFolder(open);
            return;
        }

    }

    if (folderKeys && folderKeys.length > ci) { // open folder
        var control = open.__folders[folderKeys[ci]];
        control.open();
        this.scrollToControl(control);

    } else if (!shiftKey
        && controllerKeys
        && folderKeys.length + controllerKeys.length > ci
    ) { // activate controller

        var folder = open.name;
        if (folder in statics.ControlValues._keys) {
            ci += Object.keys(statics.ControlValues._keys[folder]).length; // vorbelegte überspringen
        }

        var control = open.__controllers[controllerKeys[ci - folderKeys]];

        if (control && control.__li.hasAttribute('data-mnemonic')) {
            if (control instanceof dat.controllers.BooleanController
                || control instanceof dat.controllers.FunctionController
            ) {
                control.domElement.click();

            } else if (control instanceof dat.controllers.NumberControllerSlider
                || control instanceof dat.controllers.NumberControllerBox
                || control instanceof dat.controllers.StringController
            ) {
                var el = control.domElement.getElementsByTagName('input')[0];
                el.focus();
                el.select();

            } else if (control instanceof dat.controllers.OptionController) {
                control.domElement.getElementsByTagName('select')[0].focus();

            } else {
                HC.log(control);
            }
        }
    }
};

/**
 *
 * @param control
 */
HC.Controller.prototype.scrollToControl = function (control) {

    setTimeout(function () {
        var container = control.__ul;
        container.scrollIntoView();
    }, 125);
};

/**
 *
 * @param item
 * @param control
 * @param show
 */
HC.Controller.prototype.updateUi = function (item, control) {

    if (!control) {
        control = this.gui;
        this.refreshLayerInfo();

        this.updateUiPasses();
    }

    var flds = control.__folders || [];

    for (var key in flds) {
        var fld = flds[key];

        this.updateUi(item, fld);
        this.updateValuesChanged(fld);
    }

    var ctrls = control.__controllers || [];

    for (var key in ctrls) {
        var ctrl = ctrls[key];
        var property = ctrl.property;

        if (!item || property == item) {
            ctrl.updateDisplay();
        }
    }
};

/**
 *
 */
HC.Controller.prototype.updateUiPasses = function () {

    if (this._passes) {
        this._passes.__controllers[0].setValue(null);

        let cs = cm.get(statics.ControlSettings.layer, 'passes');
        let passes = cs.getShaderPasses();

        for (let f in this._passes.__folders) {
            this._passes.removeFolder(f);
        }

        for (let k in passes) {
            let name = cs.getShaderName(k);
            let sh = cs.getShader(k);
            let ctrl = new HC.Controller.ShaderPassController(name);
            ctrl.init(sh);
            this.addShaderPassController(ctrl, this._passes);
        }
    }
};

/**
 *
 */
HC.Controller.prototype.showDisplayControls = function () {
    for (var i = 0; i < statics.DisplayValues.display.length; i++) {
        var n = 'display' + i;
        var v = statics.DisplaySettings[n + '_visible'];
        this.showControls(n, 'g_sources', v);

        n = '_display' + i;
        this.showControls(n, 'g_displays', v);
    }
};


/**
 *
 * @param folder
 */
HC.Controller.prototype.updateValuesChanged = function (folder) {

    var changed = false;

    if (!folder) {
        folder = this.gui;
    }

    var flds = folder.__folders || [];

    for (var key in flds) {
        var fld = flds[key];

        if (this.updateValuesChanged(fld)) {
            changed = true;
        }
    }

    var ctrls = folder.__controllers || [];

    for (var key in ctrls) {
        var ctrl = ctrls[key];
        var li = ctrl.__li;

        if (ctrl.isModified()) {
            li.setAttribute('data-changed', true);
            changed = true;

        } else {
            li.removeAttribute('data-changed');
        }
    }

    var ul = folder.__ul || folder.__gui.__ul;
    if (ul && changed) {
        ul.setAttribute('data-changed', true);

    } else {
        ul.removeAttribute('data-changed');
    }

    return changed;
};

/**
 *
 */
HC.Controller.prototype.updateThumbs = function () {

    for (var i = 0; i < statics.SourceValues.sample.length; i++) {
        var sampleKey = getSampleKey(i);
        var enabledKey = getSampleEnabledKey(i);
        var sampleNode = document.querySelector('[data-id="' + enabledKey + '"]');

        var data = false;
        if (sampleKey in statics.DataSettings) {
            data = statics.DataSettings[sampleKey];
        }

        var enabled = getSampleEnabledBySample(i) && (data != false);
        if (enabled) {
            var src = data.thumbs[Math.round(data.thumbs.length / 2)].src;
            sampleNode.setAttribute('style', 'background: url(' + src + ') center center; background-size: 50%')

        } else {
            sampleNode.removeAttribute('style');
        }
    }
};

/**
 *
 * @param item
 * @param parent
 * @param enabled
 */
HC.Controller.prototype.showControls = function (item, parent, enabled) {
    requestAnimationFrame(function () {
        var n = item.replace(/(display\d+)[^0-9]+/, '$1');
        var q = '[data-id^="' + n + '"]';
        var elem = document.querySelectorAll(q);
        for (var i = 0; i < elem.length; i++) {
            var e = elem[i];
            if (e.getAttribute('data-parent') == parent) {
                if (enabled) {
                    e.style.display = '';
                } else {
                    e.style.display = 'none';
                }
            }
        }
    });
};

/**
 *
 * @param name
 */
HC.Controller.prototype.loadClip = function (i) {
    var smp = new HC.Sample(i);
    var inst = this;

    smp.clip(function (sample) {
        var data = {data: {DataSettings: {}}};
        data.data.DataSettings[getSampleKey(sample.index)] = sample._clip;
        inst.updateData(data);

        var recordKey = getSampleRecordKey(sample.index);
        var data = {query: '[data-id="' + recordKey + '"]', key: 'data-color', value: 'green'};
        messaging.onAttr(data);
        data = {query: '[data-id="' + recordKey + '"]', key: 'data-label', value: ''};
        messaging.onAttr(data);
        data = {command: 'off', data: MIDI_ROW_ONE[sample.index]};
        messaging.onMidi(data);
    });
};

/**
 *
 * @param seq
 */
HC.Controller.prototype.updateIndicator = function (seq) {
    var sample = getSampleBySequence(seq);
    var sampleKey = getSampleKey(sample);
    var data = false;
    if (sampleKey in statics.DataSettings) {
        data = statics.DataSettings[sampleKey];
    }
    var sequenceKey = getSequenceKey(seq);
    var indicatorKey = sequenceKey + '_indicator';
    var indicatorNode = document.getElementById(indicatorKey);
    if (indicatorNode) {
        var left = 0;
        var width = 0;
        var beats = 0;
        if (data) {
            var start = getSequenceStart(seq);
            var end = getSequenceEnd(seq);
            var frames = data.frames;
            var sequence = {
                start: 0,
                end: 0,
                length: 0
            };
            applySequenceSlice(sequence, frames, start, end);

            var frameDuration = data.duration / frames;
            var beatDuration = data.duration / data.beats;
            var sliceDuration = sequence.length * frameDuration;
            beats = sliceDuration / beatDuration;
            width = sequence.length / frames * 100;
            left = sequence.start / frames * 100;
        }

        indicatorNode.setAttribute('data-label', beats.toFixed(2));
        indicatorNode.style.left = left + '%';
        indicatorNode.style.width = (width - .5) + '%';
    }

};

/**
 *
 * @param seq
 */
HC.Controller.prototype.updateClip = function (seq) {

    var sequenceKey = getSequenceKey(seq);
    //var sequenceInUse = getSequenceInUse(seq);
    var sample = getSampleBySequence(seq);
    var sampleKey = getSampleKey(sample);
    var clipKey = sequenceKey + '_clip';
    var clipNode = document.getElementById(clipKey);
    var indicatorKey = sequenceKey + '_indicator';
    var indicatorNode = document.getElementById(indicatorKey);
    var sequenceQuery = sequenceKey + '_';
    var sequenceNodes = document.querySelectorAll('[data-id^="' + sequenceQuery + '"]');
    var firstNode = sequenceNodes[0];
    var lastNode = sequenceNodes[sequenceNodes.length - 3]; // -3 because _rereset

    var data = false;
    if (sampleKey in statics.DataSettings) {
        data = statics.DataSettings[sampleKey];
    }

    var enabled = getSampleEnabledBySequence(seq) && (data != false);

    if (!clipNode) {
        var clone = lastNode.cloneNode();
        clone.setAttribute('class', 'scrollx');
        clone.removeAttribute('data-parent');
        clone.removeAttribute('data-id');
        clone.removeAttribute('data-class');
        clone.removeAttribute('data-mnemonic');
        lastNode.parentNode.insertBefore(clone, lastNode.nextSibling);

        clipNode = document.createElement('div');
        clipNode.id = clipKey;
        clipNode.setAttribute('class', 'thumbs');

        clone.appendChild(clipNode);

        indicatorNode = document.createElement('div');
        indicatorNode.id = indicatorKey;
        indicatorNode.setAttribute('class', 'indicator');
        clone.appendChild(indicatorNode);
    }

    var clipSample = parseInt(clipNode.getAttribute('data-sample'));
    var clipEnabled = clipNode.getAttribute('data-enabled') === 'true';
    clipNode.setAttribute('data-sample', sample);
    clipNode.setAttribute('data-enabled', enabled);
    //clipNode.style.background = '#ccc';

    if (data) {
        //if (sequenceInUse) {
        firstNode.setAttribute('data-color', 'green');
        //
        //} else {
        //    firstNode.setAttribute('data-color', 'yellow');
        //}

        if (clipEnabled != enabled || clipSample != sample) {
            clipNode.innerHTML = '';

        } else {
            return;
        }

        var thumbs = data.thumbs;
        var max = 24;

        for (var i = 0; i < thumbs.length && i < max; i++) {

            var frameIndex = data.thumbs[i]._index;

            var img = data.thumbs[i].cloneNode();
            var div = document.createElement('div');
            div.setAttribute('class', 'thumb');
            div.setAttribute('data-index', frameIndex);

            div.appendChild(img);

            clipNode.appendChild(div);

        }

    } else {
        firstNode.setAttribute('data-color', 'red');
        clipNode.innerHTML = '';
    }
};
