/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PropertyUi} from "./PropertyUi";
import {ControlSetGuifyUi} from "./controlset/ControlSetGuifyUi";
import {ShaderPassUi} from "./ShaderPassUi";

class AnimationSettingsUi extends PropertyUi {

    addControllers(controlSets) {
        for (let cs in controlSets) {
            let set = controlSets[cs];
            if (set.visible !== false) {
                let ui = new ControlSetGuifyUi(set, this);
                ui.addFolder(true);
                ui.addControllers();
            }
        }
    }

    updatePasses(controlSet) {
        let passFld = this.getChild('passes');
        if (passFld && passFld.getChild('pass')) {
            passFld.getChild('pass').setValue(null);

            let shaders = controlSet.getShaderPasses();

            for (let k in passFld.children) {
                if (k === 'pass')continue;
                passFld.removeChild(k);
            }

            for (let k in shaders) {
                let key = controlSet.getShaderPassKey(k);
                let name = controlSet.getShaderName(k);
                let sh = controlSet.getShader(k);
                let ctrl = new ShaderPassUi(name, controlSet, this.config);
                ctrl.init(sh);
                this.addShaderPassController(key, ctrl, passFld);
            }
        }
    }

    addShaderPassController(key, control, parent) {
        let folder = parent.addFolder(key);
        let sh = control.getShader();
        this.addShaderController(folder, false, sh, control.name, control);

        let clear = document.createElement('div');
        clear.classList.add('guify-component-container');
        clear.classList.add('clear');
        folder.getFolderContainer().appendChild(clear);
    }

    addShaderController(folder, key, settings, parent, control) {

        control = control || new ShaderPassUi(parent, this.config);
        let initialSettings = control.getInitialSettings() || {}; // fallback 4 cleaned settings from storage
        let submit = control.onChange();

        for (let subsetKey in settings) {
            let setting = settings[subsetKey];
            let initialSetting = initialSettings[subsetKey] || {};

            let label = subsetKey;

            let _opts = function (label, onChange, folder, property, object) {
                return {
                    label: label,
                    onChange: onChange,
                    folder: folder,
                    property: property,
                    object: object,
                    cssClasses: 'clear',
                    uniqueKey: folder.getLabel() + '.' + key + '.' + label,
                };
            };

            let opts = _opts(label, submit, folder, subsetKey, settings);

            switch(subsetKey) {
                case 'apply':
                    opts.dataClass = 'half';
                    break;

                case 'random':
                    opts.dataClass = 'half';
                    opts.cssClasses = 'noclear';
                    break;
            }

            if (typeof setting === 'boolean') { // apply, etc.
                opts.type = 'checkbox';
                folder.addController(opts);

            } else if (typeof setting === 'number') {
                opts.type = 'range';
                opts.step = 1;

                folder.addController(opts);

            } else {
                let v = ('value' in setting) ? setting['value'] : null;

                if (v !== null) {
                    let range = ('_type' in setting) ? setting['_type'] : (('_type' in initialSetting) ? initialSetting['_type'] : null);
                    let audio = ('audio' in setting) ? setting['audio'] : null;
                    let stepwise = ('stepwise' in setting) ? setting['stepwise'] : null;
                    let oscillate = ('oscillate' in setting) ? setting['oscillate'] : null;

                    label = (key ? (key + '_') : '') + subsetKey;

                    opts = _opts(label, submit, folder, 'value', setting);

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
                        let _label = subsetKey + '_audio';

                        opts = _opts(_label, submit, folder, 'audio', setting);
                        opts.type = 'checkbox';
                        opts.dataClass = 'quarter';
                        opts.cssClasses = 'clear';

                        folder.addController(opts);
                    }

                    if (stepwise !== null) {
                        let _label = subsetKey + '_stepwise';

                        opts = _opts(_label, submit, folder, 'stepwise', setting);
                        opts.type = 'checkbox';
                        opts.dataClass = 'quarter';
                        opts.cssClasses = 'noclear';

                        folder.addController(opts);
                    }

                    if (oscillate !== null) {
                        let _label = subsetKey + '_oscillate';
                        opts = _opts(_label, submit, folder, 'oscillate', setting);
                        opts.type = 'select';
                        opts.options = this.config.AnimationValues.oscillate;
                        opts.dataClass = 'half';
                        opts.cssClasses = 'noclear';

                        folder.addController(opts);
                    }

                } else { // go deeper
                    this.addShaderController(folder, subsetKey, setting, parent, control);
                }
            }
        }
    }

    addPassesFolder(onChange, props, shaders) {
        let oldFolder = this.getChild('passes');
        if (oldFolder) {
            this.removeChild(oldFolder);
        }
        let ui = new ControlSetGuifyUi(props, this);
        let dir = ui.addFolder(false);

        dir.addSelectController('pass', 'pass', {pass: ''}, shaders, onChange);
    }
}

export {AnimationSettingsUi}