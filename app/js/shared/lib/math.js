/**
 *
 * @param min
 * @param max
 * @param negative
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
 * @param distraction
 * @returns {boolean}
 */
function randomBool(distraction) {
    if (distraction) {
        return randomInt(0, distraction) === distraction;
    }

    return Math.random() < 0.5;
}

/**
 *
 * @param min
 * @param max
 * @param digits
 * @param negative
 * @returns {number}
 */
function randomFloat(min, max, digits, negative) {
    let v = round(Math.random() * (max - min) + min, digits);
    if (negative) {
        v *= (randomBool() ? 1 : -1);
    }

    return v;
}

/**
 *
 * @param v
 * @param digits
 * @returns {number}
 */
function round(v, digits) {
    let p = Math.pow(10, digits || 0);
    v = Math.round(p * v);
    v = v / p;

    return v;
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