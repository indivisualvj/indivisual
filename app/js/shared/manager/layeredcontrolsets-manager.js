/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.LayeredControlSetsManager}
     */
    HC.LayeredControlSetsManager = class LayeredControlSetsManager {

        static _mappings = false;
        static _oscillatorProperties = false;
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
            let v = value;
            if (cs) {
                v = cs.set(property, value);

                if (this.globalProperties) {
                    this.globalProperties[set].set(property, value);
                }
            } else {
                console.error('property combination unknown', set, property, value);
            }

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

            let controlSets = this.getLayerProperties(layer);
            return controlSets[set];
        }

        /**
         *
         * @param layer
         * @returns {Object.<string, HC.ControlSet>}
         */
        getLayerProperties(layer) {
            layer = this.getLayer(layer);

            if (!layer.controlSets) {
                this.setLayerProperties(layer, HC.LayeredControlSetsManager.initAll(this.pluggedValues));
            }

            return layer.controlSets;
        }

        /**
         *
         * @param layer
         * @param controlSets
         */
        setLayerProperties(layer, controlSets) {
            layer = this.getLayer(layer);

            layer.controlSets = controlSets;
        }

        /**
         *
         * @param layer
         * @returns {Object.<string, Object>}
         */
        getLayer(layer) {
            if (isNumber(layer) || isString(layer)) {
                layer = parseInt(layer);

                while (!(layer in this.layers)) {
                    this.layers.push({});
                }

                layer = this.layers[layer];
            }

            return layer;
        }

        /**
         *
         * @param layer
         */
        resetLayer(layer) {
            let controlSets = this.getLayerProperties(layer);

            for (let k in controlSets) {
                controlSets[k].reset();
            }

        }

        /**
         *
         * @param layer
         * @return {Object.<string, Object>}
         */
        prepareLayer(layer) {
            let sets = {};
            let controlSets = this.getLayerProperties(layer);

            for (let k in controlSets) {
                sets[k] = controlSets[k].properties;
            }

            return sets;
        }

        /**
         *
         * @return {Object.<string, HC.ControlSet>}
         */
        getGlobalProperties() {
            if (!this.globalProperties) {
                this.globalProperties = HC.LayeredControlSetsManager.initAll(this.pluggedValues);
            }

            return this.globalProperties;
        }

        /**
         *
         * @param layer
         * @returns {boolean}
         */
        isDefault(layer) {
            let controlSets = this.getLayerProperties(layer);

            for (let key in controlSets) {
                let set = controlSets[key];
                if (!set.isDefault()) {
                    return false;
                }
            }

            return true;
        }

        /**
         *
         */
        reset(heap) {

            if (this.globalProperties) {
                let controlSets = this.globalProperties.controlSets;

                for (let k in controlSets) {
                    controlSets[k].reset();
                }
            }

            for (let layer in this.layers) {

                // fixme: continue if heap and heap NOT contains layer

                this.resetLayer(layer);

                if (this.layers[layer]._current) {
                    this.layers[layer]._current = false;
                }
            }
        }

        /**
         *
         */
        static typesProxy(controlSets) {

            let proxy = {};

            for (let set in controlSets) {
                let cs = controlSets[set];
                proxy = {...proxy, ...cs.types};
            }

            return proxy;
        }

        /**
         *
         * @param controlSets
         * @returns {Proxy}
         */
        static settingsProxy(controlSets) {

            let mappings = HC.LayeredControlSetsManager.mappings(controlSets);

            let proxy = new Proxy(controlSets, {

                has(target, name) {
                    let key = mappings[name];
                    let set = target[key];

                    if (set) {
                        return true;
                    }

                    return false;
                },

                get(target, name, receiver) {
                    return target[mappings[name]].properties[name];
                },

                set(target, name, value, receiver) {
                    let key = mappings[name];
                    let set = target[key];

                    if (set) {
                        let props = set.properties;

                        if (name in props) {
                            props[name] = value;

                            return true;
                        }
                    }

                    return false;
                }
            });

            return proxy;
        }

        /**
         *
         */
        static mappings(controlSets) {
            if (!HC.LayeredControlSetsManager._mappings) {
                let mappings = {};

                if (typeof controlSets == 'function') {
                    controlSets = controlSets();
                }

                for (let set in controlSets) {
                    let settings = controlSets[set].settings;

                    for (let prop in settings) {
                        mappings[prop] = set;
                    }
                }

                HC.LayeredControlSetsManager._mappings = mappings;
            }

            return HC.LayeredControlSetsManager._mappings;
        }

        /**
         *
         * @param pluggedValues
         */
        static initAll(pluggedValues) {
            let controlSets = {};
            for (let key in messaging.program.config.ControlSets) { // statics.ControlSets SORTED
                let cs = new HC.controls[key](key);
                cs.init(pluggedValues);

                controlSets[key] = cs;
            }

            return controlSets;
        }

        /**
         *
         * @returns {{}}
         */
        static getAllOsciProperties() {
            if (!HC.LayeredControlSetsManager._oscillatorProperties) {
                let controlSets = HC.LayeredControlSetsManager.initAll({});
                let oscis = [];
                for (let set in controlSets) {
                    let settings = controlSets[set].settings;

                    for (let prop in settings) {
                        if (prop + '_oscillate' in settings) {
                            oscis.push(prop);
                        }
                        // if (prop.endsWith('_oscillate')) {
                        //     oscis.push(prop.replace('_oscillate', ''));
                        // }
                    }
                }

                HC.LayeredControlSetsManager._oscillatorProperties = oscis;
            }

            return HC.LayeredControlSetsManager._oscillatorProperties;
        }
    }
}
