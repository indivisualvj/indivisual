/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.Statics = HC.Statics || {};

// todo HC.Configuration to be CLASS and .loadResources instead of _setup.js loadResources !? move all statics calls to animation.config. / controller.config.

{
    /**
     *
     */
    HC.Statics.initControlControlSets = function () {
        let instances = {};

        for (let cs in HC.ControlController) {
            let set = HC.ControlController[cs];
            let inst = new set(cs);
            inst.init(statics.ControlValues);
            instances[cs] = inst;
        }

        return instances;
    };

    /**
     *
     */
    HC.Statics.initDisplayControlSets = function () {
        let instances = {};

        for (let cs in HC.DisplayController) {
            let group = HC.DisplayController[cs];
            for (let s in group) {
                let set = group[s];
                let inst = new set(s);
                inst.init(statics.DisplayValues);
                instances[cs + '.' + s] = inst;
            }
        }

        return instances;
    };

    /**
     *
     */
    HC.Statics.initSourceControlSets = function () {
        let instances = {};

        for (let cs in HC.SourceController) {
            let set = HC.SourceController[cs];
            let inst = new set(cs);
            inst.init(statics.SourceValues);
            instances[cs] = inst;
        }

        return instances;
    };
}
