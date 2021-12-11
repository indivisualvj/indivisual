/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
class ControlSetManager
{
    /**
     * @type {Object.<string, ControlSet>}
     */
    controlSets;

    /**
     * @type {Object.<string, *>}
     */
    _mappings;

    /**
     *
     * @param controlSets
     */
    constructor(controlSets) {
        this.controlSets = controlSets;
    }

    /**
     *
     * @param set
     * @param property
     * @param value
     * @return {*}
     */
    update(set, property, value) {
        let cs = this.get(set);
        return cs.set(property, value);
    }

    /**
     *
     * @param item
     * @param value
     */
    updateItem(item, value) {
        let mappings = this.mappings();
        return this.update(mappings[item], item, value);
    }

    /**
     *
     * @param data
     * @return {Array}
     */
    updateData(data) {
        let updated = [];
        for (let k in data) {
            let set = k;
            let dat = data[set];

            for (let l in dat) {
                let prop = l;
                let val = dat[prop];
                data[set][prop] = this.update(set, prop, val);
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
     * @param set
     * @return {ControlSet}
     */
    get(set) {
        return this.controlSets[set];
    }

    /**
     *
     * @return {Object.<string, Object>}
     */
    prepare() {
        let sets = {};

        for (let k in this.controlSets) {
            sets[k] = this.controlSets[k].properties;
        }

        return sets;
    }

    /**
     *
     * @returns {{}}
     */
    prepareFlat() {
        let sets = this.prepare();
        let settings = {};

        for (let k in sets) {
            for (let i in sets[k]) {
                settings[i] = sets[k][i];
            }
        }

        return settings;
    }

    /**
     *
     * @returns {boolean}
     */
    isDefault() {
        for (let key in this.controlSets) {
            let set = this.controlSets[key];
            if (!set.isDefault()) {
                return false;
            }
        }

        return true;
    }

    /**
     *
     */
    reset() {
        for (let k in this.controlSets) {
            this.controlSets[k].reset();
        }
    }

    /**
     *
     */
    typesProxy() {

        let proxy = {};

        for (let set in this.controlSets) {
            let cs = this.get(set);
            proxy = {...proxy, ...cs.types};
        }

        return proxy;
    }

    /**
     *
     */
    valuesProxy(proxy) {

        for (let set in this.controlSets) {
            let cs = this.get(set);
            proxy = {...proxy, ...cs.values};
        }

        return proxy;
    }

    /**
     *
     * @return {boolean|Record<string, ControlSet>|*}
     */
    settingsProxy() {

        let mappings = this.mappings();

        return new Proxy(this.controlSets, {

            has(target, name) {
                let key = mappings[name];
                let set = target[key];

                if (set) {
                    return true;
                }

                return false;
            },

            get(target, name, receiver) {
                let key = mappings[name];
                let set = target[key];

                // if (set) {
                    let props = set.properties;

                    // if (name in props) {
                        return props[name];
                    // }
                // }
                //
                // return undefined;
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
    }

    /**
     *
     */
    mappings() {
        if (!this._mappings) {
            let mappings = {};

            for (let set in this.controlSets) {
                let settings = this.controlSets[set].settings;

                for (let prop in settings) {
                    mappings[prop] = set;
                }
            }
            this._mappings = mappings;
        }
        return this._mappings;
    }
}

export {ControlSetManager}