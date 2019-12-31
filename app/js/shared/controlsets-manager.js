/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{

    /**
     *
     * @type {HC.ControlSetsManager}
     */
    HC.ControlSetsManager = class ControlSetsManager {

        static _mappings = false;
        layers;
        pluggedValues;
        globalProperties;

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
         */
        update(layer, set, property, value) {
            let cs = this.get(layer, set);
            let v = cs.set(property, value);

            if (this.globalProperties) {
                this.globalProperties[set].set(property, value);
            }

            // todo update globalProperties
            return v;
        }

        /**
         *
         * @param layer
         * @param data
         * @returns {Array}
         */
        updateData(layer, data) {
            let updated = [];
            for (let k in data) {
                let set = k;
                let dat = data[set];
                for (let l in dat) {
                    let prop = l;
                    let val = dat[prop];
                    data[set][prop] = this.update(layer, set, prop, val);
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

            let controlsets = this.getLayerProperties(layer);


            return controlsets[set];
        }

        /**
         *
         * @param layer
         * @returns {boolean|*}
         */
        getLayerProperties(layer) {
            layer = this.getLayer(layer);

            if (!layer.controlsets) {
                this.setLayerProperties(layer, HC.ControlSetsManager.initAll(this.pluggedValues));
            }

            return layer.controlsets;
        }

        /**
         *
         * @param layer
         * @param controlsets
         * @returns {*}
         */
        setLayerProperties(layer, controlsets) {
            layer = this.getLayer(layer);

            layer.controlsets = controlsets;

            return layer;
        }

        /**
         *
         * @param layer
         * @returns {*}
         */
        getLayer(layer) {
            if (isNumber(layer) || isString(layer)) {
                layer = this.layers[layer];
            }

            return layer;
        }

        /**
         *
         * @param layer
         */
        prepareLayer(layer) {
            let sets = {};
            let controlsets = this.getLayerProperties(layer);

            for (let k in controlsets) {
                sets[k] = controlsets[k].properties;
            }

            return sets;
        }

        /**
         *
         */
        getGlobalProperties() {
            if (!this.globalProperties) {
                this.globalProperties = HC.ControlSetsManager.initAll(this.pluggedValues);
            }

            return this.globalProperties;
        }

        /**
         * fixme NOT a final solution!  drops rms by 1! rewrite all plugins and everything...
         * @param controlsets
         * @returns {Proxy}
         */
        static proxy(controlsets) {

            let mappings = HC.ControlSetsManager.mappings(controlsets);

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
                    let key = mappings[name];
                    let set = target[key];

                    if (set) {
                        let props = set.properties;

                        if (name in props) {
                            props[name] = value;

                            return value;
                        }
                    }

                    return undefined;
                }
            });
            return proxy;
        }

        /**
         *
         */
        static mappings(controlsets) {
            if (!HC.ControlSetsManager._mappings) {
                let mappings = {};
                for (let set in controlsets) {
                    let settings = controlsets[set].settings;

                    for (let prop in settings) {
                        mappings[prop] = set;
                    }
                }

                HC.ControlSetsManager._mappings = mappings;
            }

            return HC.ControlSetsManager._mappings;
        }

        /**
         *
         * @param pluggedValues
         */
        static initAll(pluggedValues) {
            let controlsets = {};
            for (let key in statics.ControlSets) {
                let cs = new HC.controls[key](key);
                cs.init(pluggedValues);

                controlsets[key] = cs;
            }

            return controlsets;
        }
    }
}