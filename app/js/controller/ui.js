/**
 *
 * @param actions
 */
HC.Controller.prototype.addAnimationControllers = function (controlSets) {

    for (let cs in controlSets) {
        let set = controlSets[cs];
        if (set.visible !== false) {
            let ui = new HC.ControlSetGuifyUi(set, this.animationSettingsGui);
            ui.addFolder();
            ui.addControllers();
        }
    }
};

/**
 *
 * @param groups
 * @param controlSets
 * @param uiClass
 * @param gui
 * @returns {*}
 */
HC.Controller.prototype.addGuifyDisplayControllers = function (groups, controlSets, uiClass, gui) {

    for (let k in groups) {
        let group = groups[k];
        let folder = gui.addFolder(k);
        let sets = {};

        for (let s in group) {
            sets[s] = controlSets[k + '.' + s];
        }

        this.addGuifyControllers(sets, uiClass, folder);
    }
};

/**
 *
 * @param controlSets
 * @param uiClass
 * @param parent
 */
HC.Controller.prototype.addGuifyControllers = function (controlSets, uiClass, parent) {
    for (let k in controlSets) {
        let inst = controlSets[k];

        if (inst.visible !== false) {
            let ui = new uiClass(inst, parent);

            if (inst instanceof HC.IterableControlSet) {
                ui.folder = parent;

            } else {
                ui.addFolder();
            }
            ui.addControllers();
        }
    }
};

/**
 * todo guify
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
 * @returns {*|dat.gui.GUI}
 */
HC.Controller.prototype.addPassesFolder = function (submit) {

    let passes = this.animationSettingsGui.getChild('passes');
    if (passes) {
        this.animationSettingsGui.removeChild(passes.getLabel());
    }
    let dir = this.animationSettingsGui.addFolder('passes');

    // todo this._addShareListener('passes', dir, true);

    dir.addSelectController('pass', 'pass', {pass: ''}, statics.Passes, submit);
};


/**
 *
 * @param controller
 * @param parent
 */
HC.Controller.prototype.addShaderPassController = function (key, controller, parent) {
    let folder = parent.addFolder(key);
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

    controller = controller || new HC.ShaderPassUi(parent);
    let shi = controller.getInitialSettings() || {}; // fallback 4 cleaned settings from storage
    let submit = controller.onChange;

    for (let skey in sh) {
        let shs = sh[skey];
        let shis = shi[skey] || {};

        let label = skey;

        let opts = {
            label: label,
            onChange: submit,
            folder: folder,
            property: skey,
            object: sh
        };

        opts.cssClasses = 'clear';

        switch(skey) {
            case 'apply':
                opts.dataClass = 'half';
                break;

            case 'random':
                opts.dataClass = 'half';
                opts.cssClasses = 'noclear';
                break;
        }

        if (typeof shs == 'boolean') { // apply, etc.
            opts.type = 'checkbox';
            folder.addController(opts);

        } else if (typeof shs == 'number') {
            opts.type = 'range';
            opts.step = 1;

            folder.addController(opts);

        } else {
            let v = ('value' in shs) ? shs['value'] : null;

            if (v !== null) {
                let range = ('_type' in shs) ? shs['_type'] : (('_type' in shis) ? shis['_type'] : null);
                let audio = ('audio' in shs) ? shs['audio'] : null;
                let stepwise = ('stepwise' in shs) ? shs['stepwise'] : null;
                let oscillate = ('oscillate' in shs) ? shs['oscillate'] : null;

                opts.object = shs;

                label = (key ? (key + '_') : '') + skey;
                let min, max, step;
                if (range) {
                    min = range[0];
                    max = range[1];
                    step = range[2];

                    opts.type = 'range';
                    opts.property = 'value';
                    opts.min = min;
                    opts.max = max;
                    opts.step = step;

                    folder.addController(opts);

                } else {
                    let type = typeof v;
                    opts.type = type==='number' ? 'range' : type==='boolean' ? 'checkbox' : 'text';
                    opts.property = 'value';
                    opts.object = shs;

                    folder.addController(opts);
                }

                if (audio !== null) {
                    let _label = skey + '_audio';

                    opts.type = 'checkbox';
                    opts.label = _label;
                    opts.property = 'audio';
                    opts.cssClasses = 'clear';
                    opts.dataClass = 'quarter';

                    folder.addController(opts);
                }

                if (stepwise !== null) {
                    let _label = skey + '_stepwise';

                    opts.type = 'checkbox';
                    opts.label = _label;
                    opts.property = 'stepwise';
                    opts.dataClass = 'quarter';
                    opts.cssClasses = 'noclear';

                    folder.addController(opts);
                }

                if (oscillate !== null) {
                    let _label = skey + '_oscillate';
                    opts.label = _label;
                    opts.type = 'select';
                    opts.property = 'oscillate';
                    opts.options = statics.AnimationValues.oscillate;
                    opts.onChange = submit;
                    opts.dataClass = 'half';
                    opts.cssClasses = 'noclear';

                    folder.addController(opts);
                }

            } else { // go deeper
                this.addShaderController(folder, skey, shs, parent, controller);
            }
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
        return this.nextOpenFolder(this.controlSettingsGui) ||
        this.nextOpenFolder(this.displaySettingsGui) ||
        this.nextOpenFolder(this.sourceSettingsGui) ||
        this.nextOpenFolder(this.animationSettingsGui) || this.controlSettingsGui;
    }

    if (control instanceof HC.GuifyGui && !control.isExpanded()) {
        return false;
    }

    if (control.children) {
        for (let k in control.children) {
            let child = control.getChild(k);
            if (child instanceof HC.GuifyFolder) {

                if (child.isExpanded()) {
                    control = this.nextOpenFolder(child);
                    break;
                }
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
    // for tutorials and to open shader passes
    console.error('not implemented');
};

/**
 *
 * @param property
 */
HC.Controller.prototype.openTreeByProperty = function (property) {

    let roots = [
        this.controlSettingsGui,
        this.displaySettingsGui,
        this.sourceSettingsGui,
        this.animationSettingsGui
    ];

    for (let k in roots) {
        let control;
        if (control = roots[k].findControlByProperty(property)) {
            this.closeAll(roots[k]);
            let scrollto = control;
            control = control.getParent();

            do {
                control.setOpen(true);
            } while(control = control.getParent())

            this.scrollToControl(scrollto);
        }
    }
};

/**
 *
 * @param key
 */
HC.Controller.prototype.openTreeByFolder = function (key) {
    let roots = [
        this.controlSettingsGui,
        this.displaySettingsGui,
        this.sourceSettingsGui,
        this.animationSettingsGui
    ];

    for (let k in roots) {
        let folder;
        if (folder = roots[k].findFolderByKey(key)) {
            this.closeAll(roots[k]);
            let scrollto = folder;

            do {
                folder.setOpen(true);
            } while(folder = folder.getParent())

            this.scrollToControl(scrollto);
        }
    }
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

    if (!control) {
        this.closeAll(this.controlSettingsGui);
        this.closeAll(this.displaySettingsGui);
        this.closeAll(this.sourceSettingsGui);
        this.closeAll(this.animationSettingsGui);
        return;
    }

    if (control instanceof HC.GuifyGui) {
        control.setOpen(false);

    } else if (control instanceof HC.GuifyFolder) {
        control.setOpen(false);
    }

    let result;
    if (control.children) {
        for (let k in control.children) {
            let child = control.getChild(k);
            if (child instanceof HC.GuifyFolder) {
                child.setOpen(false);
                result = child;
                this.closeAll(child);
            }
        }
    }

    return result;
};

/**
 *
 * @param ci
 * @param shiftKey
 */
HC.Controller.prototype.toggleByKey = function (ci, char, shiftKey) {
    let roots = [
        this.controlSettingsGui,
        this.displaySettingsGui,
        this.sourceSettingsGui,
        this.animationSettingsGui
    ];
    let open = this.nextOpenFolder();

    if (!open.isExpanded()) {
        if (ci < roots.length) {
            roots[ci].setOpen(true);
        }
        return;
    }

    let controllers = open.getControllers();

    if (shiftKey && controllers.length > 0) { // reset on shift
        this.resetFolder(open);
        return;
    }

    let ctrl = open.toggleByMnemonic(char);
    this.scrollToControl(ctrl);
};

/**
 *
 * @param control
 */
HC.Controller.prototype.scrollToControl = function (control) {

    if (control) {
        setTimeout(function () {
            var container = control.getContainer();
            container.scrollIntoView();
        }, 125);
    }
};

/**
 *
 * @param control
 */
HC.Controller.prototype.updateUi = function (control) {

    this.refreshLayerInfo();

    if (!control) {
        this.updateValuesChanged(this.controlSettingsGui);
        this.updateValuesChanged(this.displaySettingsGui);
        this.updateValuesChanged(this.sourceSettingsGui);
        this.updateValuesChanged(this.animationSettingsGui);
        return;
    }

    if (control == this.animationSettingsGui) {
        this.updateUiPasses();
    }

    for (let key in control.children) {
        let child = control.getChild(key);

        if (child instanceof HC.GuifyFolder) {
            this.updateValuesChanged(child);
        }
    }
};

/**
 * 
 */
HC.Controller.prototype.updateUiPasses = function () {

    let passFld = this.animationSettingsGui.getChild('passes');
    if (passFld && passFld.getChild('pass')) {
        passFld.getChild('pass').setValue(null);

        let cs = cm.get(statics.ControlSettings.layer, 'passes');
        let passes = cs.getShaderPasses();

        for (let k in passFld.children) {
            if (k == 'pass')continue;
            passFld.removeChild(k);
        }

        for (let k in passes) {
            let key = cs.getShaderPassKey(k);
            let name = cs.getShaderName(k);
            let sh = cs.getShader(k);
            let ctrl = new HC.ShaderPassUi(name);
            ctrl.init(sh);
            this.addShaderPassController(key, ctrl, passFld);
        }
    }
};

/**
 *
 */
HC.Controller.prototype.showDisplayControls = function () {
    for (let i = 0; i < statics.DisplayValues.display.length; i++) {
        let key = 'display' + i;
        let visible = statics.DisplaySettings[key + '_visible'];

        let displays = this.displaySettingsGui.children.displays.children;
        let display = displays[key];
        display.setVisible(visible);

        let sources = this.sourceSettingsGui.children.source.children;
        let sk = key + '_source';
        let ctrl = sources[sk];
        ctrl.setVisible(visible);
        sk = key + '_sequence';
        ctrl = sources[sk];
        ctrl.setVisible(visible);
    }
};


/**
 *
 * @param folder
 */
HC.Controller.prototype.updateValuesChanged = function (folder) {

    let changes = false;

    if (!folder) {
        this.updateValuesChanged(this.controlSettingsGui);
        this.updateValuesChanged(this.displaySettingsGui);
        this.updateValuesChanged(this.sourceSettingsGui);
        this.updateValuesChanged(this.animationSettingsGui);
        return;
    }

    for (let key in folder.children) {
        let child = folder.getChild(key);
        let changed = false;
        if (child instanceof HC.GuifyFolder) {
            changed = this.updateValuesChanged(child);

        } else {
            changed = child.isModified();
        }

        if (changed) {
            changes = true;
            child.getContainer().setAttribute('data-changed', true);

        } else {
            child.getContainer().removeAttribute('data-changed');
        }
    }

    if (changes) {
        folder.getContainer().setAttribute('data-changed', true);

    } else {
        folder.getContainer().removeAttribute('data-changed');
    }


    return changes;
};

/**
 *  todo guify
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
 * todo guify
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
 * todo guify
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
 * todo guify
 * @param seq
 */
HC.Controller.prototype.updateClip = function (seq) {

    var sequenceKey = getSequenceKey(seq);
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

    if (data) {
        firstNode.setAttribute('data-color', 'green');

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
