/**
 * todo HC.
 * @param i
 * @returns {boolean}
 */
function layerShuffleable(i) {
    var shuffleable = splitToShuffleable(statics.ControlSettings.shuffleable);
    if (!shuffleable || shuffleable.length < 1) {
        return true;

    } else if (shuffleable.indexOf(i) > -1) {
        return true;
    }

    return false;
}

/**
 * todo HC.
 * @param value
 * @returns {*}
 */
function splitToShuffleable(value) {

    if (value && isString(value)) {
        var arr = value.split(',');
        return arr.map(function (it) {
            return parseInt(it) - 1;
        });

    } else if (isInteger(value)) {
        return [value - 1];

    } else {
        return [];
    }
}

/**
 * todo HC.
 * @param obj
 */
function threeDispose(obj) {
    if (obj.dispose) {
        obj.dispose();
    }
    if (obj.material) {
        obj.material.dispose();
    }
    if (obj.geometry) {
        obj.geometry.dispose();
    }
}