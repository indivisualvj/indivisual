/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {

    /**
     *
     * @param definition
     * @param values
     * @constructor
     */
    HC.AnimationController = function (definition, values) {

        for (var folder in definition) {
            var items = definition[folder];

            if (!(folder in this)) {
                this[folder] = {};
            }

            for (var item in items) {
                if (!(item in this[folder])) {
                    var value = values[item];
                    this[folder][item] = value;
                }
            }
        }

    };
})();