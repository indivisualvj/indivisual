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
 * @param property
 */
HC.Controller.prototype.openTreeByProperty = function (property) {

    let roots = this.guis;

    for (let k in roots) {
        let control;
        if ((control = roots[k].findControlByProperty(property))) {
            this.closeAll(roots[k]);
            let scrollto = control;
            roots[k].setOpen(true);

            while(control = control.getParent()) {
                control.setOpen(true);
            }

            this.scrollToControl(scrollto);
        }
    }
};

/**
 *
 * @param path
 * @returns {boolean}
 */
HC.Controller.prototype.openTreeByPath = function (path) {
    let roots = this.guis;

    for (let k in roots) {
        this.closeAll(roots[k]);
        let folder = roots[k].openByPath(path);
        if (folder) {
            roots[k].setOpen(true);
            this.scrollToControl(folder);
            return true;
        }
    }

    return false;
};

/**
 *
 * @param item
 * @param value
 * @param tree
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
 * @param control
 */
HC.Controller.prototype.openAll = function (control) {

    if (!control) {
        this.guis.forEach((gui) => {
            this.openAll(gui);
        })
        return;
    }

    if (control instanceof HC.Guify) {
        control.setOpen(true);

    } else if (control instanceof HC.GuifyFolder) {
        control.setOpen(true);
    }

    let result;
    if (control.children) {
        for (let k in control.children) {
            let child = control.getChild(k);
            if (child instanceof HC.GuifyFolder) {
                child.setOpen(true);
                result = child;
                this.openAll(child);
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

    // start a search on shift if possible or..
    // expand next open (only root guis are affected)
    if (!shiftKey && !open.isExpanded()) {
        if (ci < roots.length) {
            if (shiftKey && open.gui.bar) {
                roots[ci].gui.bar.input.focus();
            } else {
                roots[ci].setOpen(true);
            }
        }
        return;
    }

    let controllers = open.getControllers();

    // reset on shift
    if (shiftKey && open.isExpanded() && controllers.length > 0) {
        this.resetFolder(open);
        return;
    }

    if (!shiftKey) {
        // toggle control by mnemonicAction (open ore toggle)
        let ctrl = open.toggleByMnemonic(char);
        this.scrollToControl(ctrl);
    }
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
 * @param {HC.Guify} control
 */
HC.Controller.prototype.updateUi = function (control) {
    let key = control ? control.getLabel() : 'all';

    HC.TimeoutManager.add('updateUi.' + key, SKIP_TEN_FRAMES, () => {
        this.refreshLayersUi();

        if (!control) {
            this._updateValuesChanged(this.controlSettingsGui);
            this._updateValuesChanged(this.displaySettingsGui);
            this._updateValuesChanged(this.sourceSettingsGui);
            this._updateValuesChanged(this.animationSettingsGui);
            this._updateValuesChanged(this.sequenceSettingsGui);
            return;
        }

        if (control === this.animationSettingsGui) {
            this.updateUiPasses();
        }

        for (let key in control.children) {
            let child = control.getChild(key);

            if (child instanceof HC.GuifyFolder) {
                this._updateValuesChanged(child);
            }
        }
    });
};

/**
 * 
 */
HC.Controller.prototype.updateUiPasses = function () {
    let controlSet = this.settingsManager.get(this.config.ControlSettings.layer, 'passes');
    this.animationSettingsGui.updatePasses(controlSet);
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
 * @returns {boolean|void}
 * @private
 */
HC.Controller.prototype._updateValuesChanged = function (folder) {

    let changes = false;

    if (!folder) {
        this._updateValuesChanged(this.controlSettingsGui);
        this._updateValuesChanged(this.displaySettingsGui);
        this._updateValuesChanged(this.sourceSettingsGui);
        this._updateValuesChanged(this.animationSettingsGui);
        this._updateValuesChanged(this.sequenceSettingsGui);
        return;
    }

    for (let key in folder.children) {
        let child = folder.getChild(key);
        let changed = false;
        if (child instanceof HC.GuifyFolder) {
            changed = this._updateValuesChanged(child);

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
 * @param index
 */
HC.Controller.prototype.loadClip = function (index) {
    let smp = new HC.Sample(this, index);

    this.sourceManager.loadClip(smp,
    (clip) => {
        this.config.DataSamples[smp.id] = clip;
        HC.EventManager.fireEventId(EVENT_CLIP_LOADED, index, this.config.DataSamples);
    });
};
