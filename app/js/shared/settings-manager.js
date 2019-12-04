/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{

    /**
     *
     * @type {HC.SettingsManager}
     */
    HC.SettingsManager = class SettingsManager {

        settings;
        layers;

        /**
         *
         * @param settings
         * @param layers
         */
        constructor(settings, layers) {
            this.settings = settings;
            this.layers = layers;
        }

        /**
         *
         */
        reset(heap) {

            this.settings.reset();

            for (let layer in this.layers) {

                if (heap && heap.length > 0) {
                    if (heap.indexOf(parseInt(layer)) < 0) {
                        continue;
                    }
                }

                this.layers[layer].settings.reset();
                if (this.layers[layer]._current) {
                    this.layers[layer]._current = false;
                }
            }
        }

        /**
         *
         * @param layer
         * @param key
         * @param value
         * @returns {*}
         */
        update(layer, key, value) {

            let l = this.get(layer);

            let v = l.settings.update(key, value);

            if (this.settings) {
                v = this.settings.update(key, value);
            }
            return v;
        }

        /**
         *
         * @param layer
         * @returns {*}
         */
        get(layer) {
            while (!layer in this.layers) {
                this.layers.push({});
            }

            if (!this.layers[layer]) {
                this.layers[layer] = {}
            }

            if (!this.layers[layer].settings) {
                let d = this.settings.defaults();
                this.layers[layer].settings = d;
            }

            return this.layers[layer];
        }
    }
}

{

    /**
     *
     * @type {HC.Settings}
     */
    HC.Settings = class Settings {

        /**
         *
         * @param values
         */
        constructor(values) {
            this.init(values);
        }

        /**
         *
         * @param values
         */
        init(values) {
            this.isdefault = null;
            this.initial = this.copy(values);

            for (let key in values) {
                this[key] = values[key];
            }
        }

        /**
         *
         * @param key
         * @param value
         * @returns {*}
         */
        update(key, value) {
            this.isdefault = null;

            let isFunc = typeof value == 'function' || typeof this[key] == 'function';

            if (key in this && isFunc) {
                // do nothing
                return value;

            } else if (value && typeof value == 'object') {

                if (key) {
                    if (key in this) {
                        this.merge(this[key], value, this.initial[key]);

                    } else {
                        this[key] = this.copy(value);
                    }

                } else {
                    this.merge(this, value, this.initial);
                }

            } else if (key) {
                this[key] = this.validate(key, value);
            }

            return key ? this[key] : this;
        }

        /**
         *
         * @param target
         * @param source
         * @param initial
         */
        merge(target, source, initial) {

            if (target) {
                // delete target items in case source does not contain
                // but this does not work if only fragments are updated ...
                // for (let k in target) {
                //     if (!(k in source)) {
                //         delete target[k];
                //     }
                // }

                for (let k in source) {
                    let value = source[k];

                    // let clean = this._clean(value);
                    // if (clean === 'delete') {
                    //     delete target[k];
                    //     return;
                    // } else if (clean) {
                    //     target = clean.target;
                    //     // k = clean.key;
                    //     value = clean.source
                    // }

                    if (target === this && k in this && typeof this[k] == 'function') {
                        // do nothing

                    } else if (value && typeof value == 'object') {

                        if (!(k in target)) {
                            target[k] = this.copy(source[k]);

                        } else {
                            this.merge(target[k], source[k], initial ? initial[k] : false);
                        }

                    } else {
                        target[k] = this.validate(k, source[k], initial);
                    }
                }
            }
        }

        /**
         *
         * @returns {*}
         */
        prepare() {

            let data = this.copy(this);

            delete data.isdefault;
            delete data.initial;
            delete data.reset;
            delete data.layers;
            delete data.settings;
            delete data.monitor;

            for (let k in data) {
                if (data[k].prepare) {
                    data[k] = data[k].prepare();
                }
            }

            return data;
        }

        /**
         * cleanses from removed settings
         * @param target
         * @param source
         */
        clean(target, source) {

            delete target.isdefault;
            delete target.initial;
            delete target._type;
            delete target.addons;

            for (let k in target) {
                let v = target[k];

                /*
                 this is a ****ing workaround to avoid settings to be deleted that were not in settings initially.
                 e.g. "passes"
                 */
                let clean = this._clean(v, false);
                if (clean) {
                    source = clean.source;
                    k = clean.key;
                    v = clean.target
                }

                if (!(k in source)) {
                    delete target[k];

                } else if (typeof v == 'object') {
                    this.clean(v, source[k]);

                } else {
                    // do nothing
                }
            }
        }

        /**
         * See Example here: HC.Controller.ShaderPassController.init
         *
         * @param v
         * @param deleet
         * @returns {string|boolean|{source: {}, value, key}}
         * @private
         */
        _clean(v, deleet = true) {
            if (v && v._clean) {
                if (deleet && v._clean._delete) {
                    let t = v._clean._delete.tree;
                    let c = v._clean._delete.condition;
                    let target = v._clean.target;
                    for (let b in t) {
                        if (t[b] in target) {
                            target = target[t[b]];
                        }
                    }

                    if (target == c) {
                        return 'delete';
                    }
                }

                return {
                    source: v._clean.source,
                    key: v._clean.key,
                    target: v._clean.target
                };
            }

            return false;
        }

        reset() {

            this.update(false, this.initial);

        }

        /**
         *
         * @param data
         * @returns {any}
         */
        copy(data) {
            // todo was soll dass? ist nicht static und macht nur was mit den gegebenen daten???
            // evtl sollte das wie get() funktionieren.
            // ne ich mach ne funktion JSON.copy!!!
            return JSON.parse(JSON.stringify(data));
        }

        /**
         *
         * @param item
         * @returns {boolean}
         */
        contains(item) {
            if (!this.initial || !(item in this.initial)) {
                return false;
            }

            return true;
        }

        /**
         *
         * @param item
         * @param value
         * @param initial
         * @returns {*}
         */
        validate(item, value, initial) {

            let type = typeof value;
            // check if string contains float and then convert
            if (type == 'string') {
                let f = parseFloat(value);
                if (f && f.toString().length == value.length) {
                    value = f;
                }
            }

            // avoid values to be overwritten by wrong type
            if (initial && item in initial) {
                let org = initial[item];
                let otype = typeof org;

                if (otype !== type) {
                    // console.log(item, type, value, otype, org);
                    value = org;
                }
            }

            return value;
        }

        /**
         *
         * @returns {null|*}
         */
        isDefault() {
            if (this.isdefault === null) {
                let prpd = JSON.stringify(this.prepare());
                let init = JSON.stringify(this.defaults().prepare());

                this.isdefault = prpd === init;
            }

            return this.isdefault;
        }

        /**
         *
         * @returns {HC.Settings}
         */
        defaults() {
            return new HC.Settings(this.copy(this.initial));
        }

        /**
         *
         * @param tree
         * @returns {*}
         */
        get(tree) {

            let item = this;
            let source;
            for (let k in tree) {
                if (tree[k] in item) {
                    source = item;
                    item = item[tree[k]];
                }
            }

            if (source && '_clean' in source && item in source._clean) {
                return source._clean[item];
            }

            return item;
        }
    }
}