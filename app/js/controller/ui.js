

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
                ctl.__li.setAttribute('data-class', bnd[bnd.length-1]);
            }
        }

        ctl.__li.setAttribute('data-id', ksub);

        if (ctl instanceof dat.controllers.NumberControllerBox
            || ctl instanceof dat.controllers.NumberControllerSlider
        ) {
            ctl.onChange(function (value) {
                submit(this.property, value);
            });
        } else {
            ctl.onFinishChange(function (value) {
                submit(this.property, value);
            });
        }
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
 * @param submit
 */
HC.Controller.prototype.addShaderControllers = function (submit) {

    var dir = controller.gui.addFolder('shaders');
    this._addShareListener('shaders', dir, true);

    for (var key in statics.ShaderSettings.initial) {
        var sh = statics.ShaderSettings[key];

        if (sh && key.indexOf('_') != 0) {
            var shd = dir.addFolder(key);
            this.addShaderController(shd, false, sh, key, submit);
        }
    }
};

/**
 *
 * @param shd
 * @param key
 * @param sh
 * @param parent
 * @param submit
 */
HC.Controller.prototype.addShaderController = function (shd, key, sh, parent, submit) {

    for (var skey in sh) {
        var shs = sh[skey];

        var ctl = false;
        var label = skey;

        if (typeof shs == 'boolean') { // apply, etc.
            ctl = shd.add(sh, skey)
                .onFinishChange(submit);

            if (skey in statics.ShaderTypes) {
                var bnd = statics.ShaderTypes[skey];
                ctl.__li.setAttribute('data-class', bnd[0]);
            }

        } else if (typeof shs == 'number') {
            ctl = shd.add(sh, skey, 0)
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
                var b = ('_type' in shs) ? shs['_type'] : null;
                var a = ('audio' in shs) ? shs['audio'] : null;
                var s = ('stepwise' in shs) ? shs['stepwise'] : null;
                var o = ('oscillate' in shs) ? shs['oscillate'] : null;

                label = (key ? (key + '_') : '') + skey;
                var min, max, step;
                if (b) {
                    min = b[0];
                    max = b[1];
                    step = b[2];

                    ctl = shd.add(shs, 'value', min, max, step)
                        .name(label)
                        .onChange(submit)
                        .onFinishChange(submit);

                    var el = ctl.domElement.getElementsByTagName('input')[0];
                    el.setAttribute('data-step', step);

                } else {
                    ctl = shd.add(shs, 'value')
                        .name(label)
                        .onFinishChange(submit);
                }

                if (a !== null) {
                    var _label = skey + '_audio';
                    var _ctl = shd.add(shs, 'audio')
                        .name(_label)
                        .onFinishChange(submit);
                    _ctl.parent = parent;
                    _ctl.label = _label;

                    if (_label) {
                        var suffix = _label.replace(/^.+_/, '_');
                        if (suffix in statics.ShaderTypes) {
                            var bnd = statics.ShaderTypes[suffix];
                            _ctl.__li.setAttribute('data-class', bnd[0]);
                        }
                    }
                }

                if (s !== null) {
                    var _label = skey + '_stepwise';
                    var _ctl = shd.add(shs, 'stepwise')
                        .name(_label)
                        .onFinishChange(submit);
                    _ctl.parent = parent;
                    _ctl.label = _label;

                    if (_label) {
                        var suffix = _label.replace(/^.+_/, '_');
                        if (suffix in statics.ShaderTypes) {
                            var bnd = statics.ShaderTypes[suffix];
                            _ctl.__li.setAttribute('data-class', bnd[0]);
                        }
                    }
                }

                if (o !== null) {
                    var _label = skey + '_oscillate';
                    var _ctl = shd.add(shs, 'oscillate', statics.ShaderValues.oscillate)
                        .name(_label)
                        .onFinishChange(submit);
                    _ctl.parent = parent;
                    _ctl.label = _label;

                    if (_label) {
                        var suffix = _label.replace(/^.+_/, '_');
                        if (suffix in statics.ShaderTypes) {
                            var bnd = statics.ShaderTypes[suffix];
                            _ctl.__li.setAttribute('data-class', bnd[0]);
                        }
                    }
                }

            } else { // go deeper
                this.addShaderController(shd, skey, shs, parent, submit);
            }
        }

        if (ctl) {
            ctl.parent = parent;
            ctl.label = label;
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
 * @param control
 */
HC.Controller.prototype.closeAll = function (control) {

    if (!control) {
        control = this.gui;
    }

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
        setTimeout(function () {
            var container = control.__ul.parentNode.parentNode;
            var coot = container.offsetTop;
            var ctrl = container.offsetParent;
            var ctot = ctrl.offsetTop;
            if (ctrl.id != 'controller') {
                coot += ctrl.offsetTop;
                ctrl = ctrl.offsetParent;
            }
            var ot = coot - ctot;
            ctrl.scrollTop = ot;
        }, 125);

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
                _log(control);
            }
        }
    }
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
    var inst = this;
    var smp = new HC.Sample(i);
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
            var end   = getSequenceEnd(seq);
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
        indicatorNode.style.width = (width-.5) + '%';
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
    var lastNode = sequenceNodes[sequenceNodes.length-3]; // -3 because _rereset

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
