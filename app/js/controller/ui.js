/**
 *
 * @param controlSets
 */
HC.Controller.prototype.addAnimationControllers = function (controlSets) {

    for (let cs in controlSets) {
        let set = controlSets[cs];
        if (set.visible !== false) {
            let ui = new HC.ControlSetGuifyUi(set, this.animationSettingsGui);
            ui.addFolder(true);
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
 *
 */
HC.Controller.prototype.addConfigurationSettings = function () {

    for (let k in this.config) {
        if (k.endsWith('Types')) {
            let object = this.config[k];
            let folder = this.configurationSettingsGui.addFolder(k);

            for (let p in object) {

                let v = object[p];

                if (isArray(v) && v.length > 1) {
                    let opts = {
                        type: 'interval',
                        label: p,
                        property: p,
                        object: object,
                        min: v[0]*2,
                        max: v[1]*2
                    };
                    folder.addController(opts);
                }
            }
        }
    }
};

HC.Controller.prototype.initStatusBar = function () {

    let ctrls = {
        play: {
            dataClass: 'quarter'
        },
        beat: {

        },
        sync: {

        },
        audio: {

        },
        layer: {

        },
        layers: {

        }
    };
};

/**
 *
 * @param submit
 */
HC.Controller.prototype.addPassesFolder = function (submit) {

    let passes = this.animationSettingsGui.getChild('passes');
    if (passes) {
        this.animationSettingsGui.removeChild(passes.getLabel());
    }
    let ui = new HC.ControlSetGuifyUi(this.settingsManager.getGlobalProperties()['passes'], this.animationSettingsGui);
    let dir = ui.addFolder();

    dir.addSelectController('pass', 'pass', {pass: ''}, this.config.AnimationValues.shaders, submit);
};


/**
 *
 * @param control
 * @param parent
 */
HC.Controller.prototype.addShaderPassController = function (key, control, parent) {
    let folder = parent.addFolder(key);
    let sh = control.getShader();
    this.addShaderController(folder, false, sh, control.name, control);

    let clear = document.createElement('div');
    clear.classList.add('guify-component-container');
    clear.classList.add('clear');
    folder.getFolderContainer().appendChild(clear);
};


/**
 *
 * @param folder
 * @param key
 * @param sh
 * @param parent
 * @param control
 */
HC.Controller.prototype.addShaderController = function (folder, key, sh, parent, control) {

    control = control || new HC.ShaderPassUi(parent, this.config);
    let shi = control.getInitialSettings() || {}; // fallback 4 cleaned settings from storage
    let submit = control.onChange();

    for (let skey in sh) {
        let shs = sh[skey];
        let shis = shi[skey] || {};

        let label = skey;

        let _opts = function (label, onChange, folder, property, object) {
            return {
                label: label,
                onChange: onChange,
                folder: folder,
                property: property,
                object: object,
                cssClasses: 'clear'
            };
        };

        let opts = _opts(label, submit, folder, skey, sh);

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

                label = (key ? (key + '_') : '') + skey;

                opts = _opts(label, submit, folder, 'value', shs);

                let min, max, step;
                if (range) {
                    min = range[0];
                    max = range[1];
                    step = range[2];

                    opts.type = 'range';
                    opts.min = min;
                    opts.max = max;
                    opts.step = step;

                    folder.addController(opts);

                } else {
                    let type = typeof v;
                    opts.type = type==='number' ? 'range' : type==='boolean' ? 'checkbox' : 'text';

                    folder.addController(opts);
                }

                if (audio !== null) {
                    let _label = skey + '_audio';

                    opts = _opts(_label, submit, folder, 'audio', shs);
                    opts.type = 'checkbox';
                    opts.dataClass = 'quarter';
                    opts.cssClasses = 'clear';

                    folder.addController(opts);
                }

                if (stepwise !== null) {
                    let _label = skey + '_stepwise';

                    opts = _opts(_label, submit, folder, 'stepwise', shs);
                    opts.type = 'checkbox';
                    opts.dataClass = 'quarter';
                    opts.cssClasses = 'noclear';

                    folder.addController(opts);
                }

                if (oscillate !== null) {
                    let _label = skey + '_oscillate';
                    opts = _opts(_label, submit, folder, 'oscillate', shs);
                    opts.type = 'select';
                    opts.options = this.config.AnimationValues.oscillate;
                    opts.dataClass = 'half';
                    opts.cssClasses = 'noclear';

                    folder.addController(opts);
                }

            } else { // go deeper
                this.addShaderController(folder, skey, shs, parent, control);
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
        return this.nextOpenFolder(this.controlSettingsGui)
            || this.nextOpenFolder(this.displaySettingsGui)
            || this.nextOpenFolder(this.sourceSettingsGui)
            || this.nextOpenFolder(this.animationSettingsGui)
            || this.nextOpenFolder(this.sequenceSettingsGui)
            || this.controlSettingsGui
        ;
    }

    if (control instanceof HC.Guify && !control.isExpanded()) {
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

    let roots = this.guis;

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
    let roots = this.guis;

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
            let proto = tree[item][value];
            let desc = proto.tutorial;
            if (desc) {
                let key = item + '.' + value;
                new HC.ScriptProcessor(this, key, desc).log();
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
        this.guis.forEach((gui) => {
            this.closeAll(gui);
        })
        return;
    }

    if (control instanceof HC.Guify) {
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
 * @param char
 * @param shiftKey
 */
HC.Controller.prototype.toggleByKey = function (ci, char, shiftKey) {
    let roots = this.guis;
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
            let container = control.getContainer();
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
        this.updateValuesChanged(this.sequenceSettingsGui);
        return;
    }

    if (control === this.animationSettingsGui) {
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

        let cs = this.settingsManager.get(this.config.ControlSettings.layer, 'passes');
        let passes = cs.getShaderPasses();

        for (let k in passFld.children) {
            if (k == 'pass')continue;
            passFld.removeChild(k);
        }

        for (let k in passes) {
            let key = cs.getShaderPassKey(k);
            let name = cs.getShaderName(k);
            let sh = cs.getShader(k);
            let ctrl = new HC.ShaderPassUi(name, this.config);
            ctrl.init(sh);
            this.addShaderPassController(key, ctrl, passFld);
        }
    }
};

/**
 *
 */
HC.Controller.prototype.showDisplayControls = function () {
    for (let i = 0; i < this.config.DisplayValues.display.length; i++) {
        let key = 'display' + i;
        let visible = this.config.DisplaySettings[key + '_visible'];

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
        this.updateValuesChanged(this.sequenceSettingsGui);
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
 *
 */
HC.Controller.prototype.updateThumbs = function () {

    for (let i = 0; i < this.config.SourceValues.sample.length; i++) {
        let sampleKey = getSampleKey(i);

        let data = false;
        if (sampleKey in this.config.DataSettings) {
            data = this.config.DataSettings[sampleKey];
        }

        this.thumbs[i].update(data);
    }
};

/**
 *
 * @param index
 */
HC.Controller.prototype.loadClip = function (index) {
    let smp = new HC.Sample(this, index);

    this.sourceManager.loadClip(smp,
    (clip) => {
        let data = {data: {DataSettings: {}}};
        data.data.DataSettings[smp.id] = clip;
        this.updateData(data);
    });
};

/**
 * 
 * @param seq
 */
HC.Controller.prototype.updateIndicator = function (seq) {

    /** @type {HC.SourceControllerSequence} */
    let clip = this.clips[seq];

    let sample = this.sourceManager.getSampleBySequence(seq);
    let sampleKey = getSampleKey(sample);
    let data = false;
    if (sampleKey in this.config.DataSettings) {
        data = this.config.DataSettings[sampleKey];
    }

    clip.updateIndicator(data);
};

/**
 *
 * @param seq
 */
HC.Controller.prototype.updateClip = function (seq) {

    /** @type {HC.SourceControllerSequence} */
    let clip = this.clips[seq];

    let sample = this.sourceManager.getSampleBySequence(seq);
    let sampleKey = getSampleKey(sample);

    let data = false;
    if (sampleKey in this.config.DataSettings) {
        data = this.config.DataSettings[sampleKey];
    }

    let enabled = this.sourceManager.getSampleEnabledBySequence(seq) && (data !== false);

    clip.update(sample, enabled, data);
};

/**
 * 
 */
HC.Controller.prototype.initClips = function () {
    this.clips = [];
    for (let seq = 0; seq < this.config.SourceValues.sequence.length; seq++) {
        // fixme: this needs to be done in SequenceControllerUi
        this.clips.push(new HC.SourceControllerSequence(this, seq));
    }

};

/**
 *
 */
HC.Controller.prototype.initThumbs = function () {

    this.sequenceSettingsGui.setOpen(true);

    let sequences = document.querySelectorAll('#SequenceSettings .sequence');
    this.thumbs = [];
    for (let seq = 0; seq < this.config.SourceValues.sample.length; seq++) {
        let sample = new HC.SourceControllerSample(this, seq);
        sample.init();
        sample.initDragAndDrop(sequences);
        this.thumbs.push(sample);
    }

    document.body.addEventListener('dragover', (e) => {
        if (!e.target.ancestorOfClass('sequence')) {
            e.dataTransfer.dropEffect = 'none';
            e.preventDefault();
            sequences.forEach((sequence) => {
                sequence.style.border = '';
            });
        }
        e.preventDefault();
    });

    window.dispatchEvent(new Event('resize'));
    this.sequenceSettingsGui.setOpen(false);
};
0