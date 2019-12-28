/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{

    /**
     *
     * @type {HC.ControlSetsManager}
     */
    HC.ControlSetsManager = class ControlSetsManager {

        layers;
        pluggedValues;

        /**
         *
         * @param layers
         * @param pluggedValues
         */
        constructor(layers, pluggedValues) {
            this.layers = layers;
            this.pluggedValues = pluggedValues;
        }

        /**
         *
         * @param layer
         * @param set
         * @param property
         * @param value
         * @returns {*}
         * @private
         */
        _update(layer, set, property, value) {
            let cs = this.get(layer, set);
            let v = cs.set(property, value);
            return v;
        }

        /**
         *
         * @param layer
         * @param data
         * @returns {Array}
         */
        update(layer, data) {
            let updated = [];
            for (let k in data) {
                let set = k;
                let dat = data[set];
                for (let l in dat) {
                    let prop = l;
                    let val = dat[prop];
                    data[set][prop] = this._update(layer, set, prop, val);
                    let upd = {
                        property: prop,
                        value: val
                    };
                    updated.push(upd);
                }
            }

            return updated;
        }

        /**
         *
         * @param layer
         * @param set
         * @returns HC.ControlSet
         */
        get(layer, set) {

            if (isNumber(layer) || isString(layer)) {
                layer = this.layers[layer];
            }

            if (!layer.controlsets) {
                layer.controlsets = {};
            }

            if (!layer.controlsets[set]) {
                let cs = new HC.controls[set](set);
                cs.init(this.pluggedValues);
                layer.controlsets[set] = cs;
            }

            return layer.controlsets[set];
        }

        /**
         * fixme NOT a final solution? is it fast enough when called in every plugin in every frame? otherwise rewrite all plugins and everything...
         * @param controlsets
         * @returns {Proxy}
         */
        static proxy(controlsets) {

            let mappings = {};
            for (let set in controlsets) {
                let settings = controlsets[set].settings;

                for (let prop in settings) {
                    mappings[prop] = set;
                }
            }

            let proxy = new Proxy(controlsets, {
                get(target, name, receiver) {
                    let key = mappings[name];
                    let set = target[key];

                    if (set) {
                        let props = set.properties;

                        if (name in props) {
                            return props[name];
                        }
                    }

                    // if (DEBUG) {
                    //     console.error('setting not found: ' + name);
                    // }

                    return undefined;
                },

                set(target, name, value, receiver) {
                    throw new Error(name + ' not settable through proxy!');
                }
            });
            return proxy;
        }

        /**
         *
         */
        static initAll() {
            let controlsets = {};
            for (let key in statics.ControlSets) {
                let cs = new HC.controls[key](key);
                cs.init(statics.AnimationValues);

                controlsets[key] = cs;
            }

            return controlsets;
        }
    }
}