/**
 *
 * @param min
 * @param max
 * @param [negative]
 * @returns {number}
 */
function randomInt(min, max, negative) {
    let v = Math.floor(Math.random() * (max - min + 1)) + min;
    if (negative) {
        v *= (randomBool() ? 1 : -1);
    }

    return v;
}

/**
 *
 * @param {int}[distraction]
 * @returns {boolean} returns true if randomInt(0, disctraction) is hit, otherwise returns true if Math.random < .5
 */
function randomBool(distraction) {
    if (distraction) {
        return randomInt(0, distraction) === distraction;
    }

    return Math.random() < 0.5;
}

/**
 *
 * @param {number}min
 * @param {number}max
 * @param {int}[digits] default=2
 * @param {boolean}[negative]
 * @returns {number}
 */
function randomFloat(min, max, digits, negative) {
    let v = round(Math.random() * (max - min) + min, Math.ceil(digits || 2));
    if (negative) {
        v *= (randomBool() ? 1 : -1);
    }

    return v;
}

/**
 *
 * @param {number}value
 * @param {int}[digits] default=0
 * @returns {number}
 */
function round(value, digits) {
    let p = Math.pow(10, Math.ceil(digits || 0));
    value = Math.round(p * value);
    value = value / p;

    return value;
}

/**
 *
 * @param value
 * @param max
 * @returns {number}
 */
function cutoff(value, max) {
    return Math.min(max, Math.max(-max, value));
}

/**
 *
 * @param value
 * @param min
 * @param max
 * @returns {number}
 */
function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

/**
 *
 * @param a
 * @param b
 * @returns {number}
 */
function sinAlpha(a, b) {
    let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    let sina = Math.asin(a / c) * 2 * DEG;

    return sina;
}

function getDigits(v) {
    let digits = v.toString();
    return digits.substr(digits.indexOf('.')+1).length;
}