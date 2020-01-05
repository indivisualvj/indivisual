/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.Statics = HC.Statics || {};

{
    /**
     *
     */
    HC.Statics.initAllControlSets = function () {
        let instances = {};

        for (let cs in HC.ControlController) {
            let set = HC.ControlController[cs];
            let inst = new set(cs);
            inst.init(statics.ControlValues);
            instances[cs] = inst;
        }

        return instances;
    }
}