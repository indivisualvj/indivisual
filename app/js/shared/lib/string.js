/**
 *
 * @param value
 * @returns {*}
 */
function splitToIntArray(value) {

    if (value && isString(value)) {
        var arr = value.split(',');
        return arr.map(function (it) {
            return parseInt(it);
        });

    } else if (isInteger(value)) {
        return [value];

    } else {
        return [];
    }
}

/**
 *
 * @returns {string}
 */
function filePath() {
    var args = Array.prototype.slice.call(arguments);
    return args.join('/');
}