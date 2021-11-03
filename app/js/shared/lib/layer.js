/**
 * fixme redesign / does not work properly
 * @param i
 * @returns {boolean}
 */
function layerShuffleable(i) {
    let shuffleable = splitToIntArray(messaging.program.config.ControlSettings.shuffleable);
    if (!shuffleable || shuffleable.length < 1) {
        return true;

    } else if (shuffleable.indexOf(i) > -1) {
        return true;
    }

    return false;
}

/**
 * 
 * @param value
 * @returns {*}
 */
function splitToIntArray(value) {

    if (value && isString(value)) {
        let arr = value.split(',');
        return arr.map(function (it) {
            return parseInt(it) - 1;
        });

    } else if (isInteger(value)) {
        return [value - 1];

    } else {
        return [];
    }
}
