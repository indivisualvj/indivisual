/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.Statics = HC.Statics || {};

// todo HC.Config to be CLASS and .loadResources instead of _setup.js loadResources !? move all statics calls to animation.config. / controller.config.

{
    /**
     *
     * @type {HC.Config}
     */
    HC.Config = class Config {

        /**
         * @type {HC.Messaging}
         */
        messaging;

        /**
         *
         * @param {HC.Messaging} messaging
         */
        constructor(messaging) {
            this.messaging = messaging;
        }

        /**
         *
         * @param resources
         * @param callback
         */
        loadResources(resources, callback) {
            let _load = (index, callback) => {

                if (index > resources.length - 1) {
                    callback();
                    return;
                }
                let rsc = resources[index];
                let action = 'get';
                if (rsc.action) {
                    action = rsc.action;
                }
                let file = filePath(rsc.base || APP_DIR, rsc.file);
                this.messaging._emit({action: action, file: file, name: rsc.name}, (data) => {
                    rsc.callback(data, () => {
                        _load(index + 1, callback);
                    });
                });
            };

            let _setup = function (callback) {
                if (!(_HASH in statics.ControlValues.session)) {
                    statics.ControlValues.session[_HASH] = _HASH;
                }

                callback();
            };

            _load(0, function () {
                _setup(callback);
            });
        }

        /**
         *
         */
        initControlControlSets() {
            let instances = {};

            for (let cs in HC.ControlController) {
                let set = HC.ControlController[cs];
                let inst = new set(cs);
                inst.init(statics.ControlValues);
                instances[cs] = inst;
            }

            return instances;
        }

        /**
         *
         */
        initDisplayControlSets() {
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
        }

        /**
         *
         */
        initSourceControlSets() {
            let instances = {};

            for (let cs in HC.SourceController) {
                let set = HC.SourceController[cs];
                let inst = new set(cs);
                inst.init(statics.SourceValues);
                instances[cs] = inst;
            }

            return instances;
        }
    }
}
