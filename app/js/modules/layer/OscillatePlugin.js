/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class OscillatePlugin extends HC.AnimationPlugin {

    /**
     *
     * @param {Animation} animation
     * @param {Layer} layer
     * @param settings
     * @param tree
     * @param key
     * @returns {HC.Plugin}
     */
    construct(animation, layer, settings, tree, key) {
        HC.AnimationPlugin.prototype.construct.call(this, animation, layer, settings, tree, key);
        this.cache = this.cache || {};

        return this;
    }

    params(key, value) {

        // create a unique key to cache progress etc.
        let ckey = '_' + (isObject(key) ? '_object_' : key);

        if (ckey in this.cache) {
            // key already exists
            if (value !== undefined) {
                this.cache[ckey] = value;
            }

        } else {
            // key does not exist
            this.cache[ckey] = isObject(this.preset) ? Object.create(this.preset) : this.preset ? this.preset : 0;
        }

        return this.cache[ckey];
    }

    store(key) {

        // store original value
        if (isObject(key)) {
            let ckey = (isObject(key) ? '_object_' : key);
            this.cache[ckey] = key.value;

        } else {
            this.cache[key] = this.settings[key];
        }

    }

    restore(key) {
        // restore original value
        if (isObject(key)) {
            let ckey = (isObject(key) ? '_object_' : key);
            key.value = this.cache[ckey];

        } else {
            this.settings[key] = this.cache[key];
        }

    }

    activate(key, value, overwrite) {

        if (isObject(key)) {
            if (overwrite) {
                key.value = value;

            } else {
                key.value *= value;
            }

            return key.value;

        } else {
            if (overwrite) {
                this.settings[key] = value;
            } else {
                this.settings[key] *= value;
            }

            return this.settings[key];
        }
    }
}

export {OscillatePlugin};
