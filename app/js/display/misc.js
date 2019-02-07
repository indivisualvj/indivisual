/**
 *
 * @param array
 * @returns {any[]}
 */
function points_reverse(array) {
    var length = array.length;
    var nu = new Array(length);

    for (var i = 0; i < length; i += 2) {
        nu[i] = array[length-2-i];
        nu[i+1] = array[length-2-i+1];
    }
    return nu;
}
