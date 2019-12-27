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

        /**
         *
         * @param settings
         * @param layers
         */
        constructor(layers) {
            this.layers = layers;
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
            return v;
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
                layer.controlsets[set] = cs;
            }

            return layer.controlsets[set];
        }
    }
}