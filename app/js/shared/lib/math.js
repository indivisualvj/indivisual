/**
 *
 * @param min
 * @param max
 * @param negative
 * @returns {*}
 */
function randomInt(min, max, negative) {
    var v = Math.floor(Math.random() * (max - min + 1)) + min;
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
        return randomInt(0, distraction) == distraction;
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
    var v = round(Math.random() * (max - min) + min, digits);
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
    var p = Math.pow(10, digits || 0);
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
 * @param aw
 * @param ah
 * @param bw
 * @param bh
 * @returns {{readArea: HC.Rectangle, writeArea: HC.Rectangle}}
 */
function cropAtoB(aw, ah, bw, bh) {
    // positive values mean a is bigger, negative values mean b is smaller
    var dx = (aw - bw) / 2;
    var dy = (ah - bh) / 2;

    var w = Math.min(bw, aw);
    var h = Math.min(bh, ah);
    return {
        readArea: new HC.Rectangle(Math.max(0, dx), Math.max(0, dy), w, h),
        writeArea: new HC.Rectangle(Math.max(0, -dx), Math.max(0, -dy), w, h)
    }
}


/**
 *
 * @param a
 * @param b
 * @returns {number}
 */
function sinAlpha(a, b) {
    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    var sina = Math.asin(a / c) * 2 * DEG;

    return sina;
}

/**
 *
 * arccos( (b² + c² - a²) / 2bc )
 * b * sin( α )
 * @param a
 * @param b
 * @param c
 * @returns {number}
 */
function heightFromThreeSides(a, b, c) {
    var upper = (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2));
    var lower = 2 * b * c;
    var alpha = Math.acos(upper / lower);
    var hc = b * Math.sin(alpha);
    return hc;
}

/**
 *
 * arccos( (a² + b² - c²) / 2ab )
 * @param a
 * @param b
 * @param c
 * @returns {number}
 */
function gammaFromThreeSides(a, b, c) {
    //
    var upper = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2));
    var lower = 2 * a * b;
    var gamma = Math.acos(upper / lower);
    return gamma * 180 / Math.PI;
}

/**
 *
 * @param vectorGamma
 * @param vectorBeta
 * @param vectorAlpha
 * @returns {number}
 */
function gammaFromThreePoints(vectorGamma, vectorBeta, vectorAlpha) {

    var a = vectorGamma.distanceTo(vectorBeta);
    var b = vectorGamma.distanceTo(vectorAlpha);
    var c = vectorAlpha.distanceTo(vectorBeta);

    if (a == 0 && b == 0 && c == 0) {
        return 0;
    }

    return gammaFromThreeSides(a, b, c);
}