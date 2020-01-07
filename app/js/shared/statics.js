/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.Statics = HC.Statics || {};

// todo HC.Statics to be CLASS and HC.Statics.loadResources instead of _setup.js loadResources !?

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
                let inst = new set(cs);
                inst.init(statics.DisplayValues);
                instances[cs] = inst;
            }
        }

        return instances;
    }
}