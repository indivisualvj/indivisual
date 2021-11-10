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
 * @param aw
 * @param ah
 * @param bw
 * @param bh
 * @returns {{readArea: HC.Rectangle, writeArea: HC.Rectangle}}
 */
function cropAtoB(aw, ah, bw, bh) {
    // positive values mean a is bigger, negative values mean b is smaller
    let dx = (aw - bw) / 2;
    let dy = (ah - bh) / 2;

    let w = Math.min(bw, aw);
    let h = Math.min(bh, ah);
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
    let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    let sina = Math.asin(a / c) * 2 * DEG;

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
    let upper = (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2));
    let lower = 2 * b * c;
    let alpha = Math.acos(upper / lower);
    let hc = b * Math.sin(alpha);
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
    let upper = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2));
    let lower = 2 * a * b;
    let gamma = Math.acos(upper / lower);
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

    let a = vectorGamma.distanceTo(vectorBeta);
    let b = vectorGamma.distanceTo(vectorAlpha);
    let c = vectorAlpha.distanceTo(vectorBeta);

    if (a === 0 && b === 0 && c === 0) {
        return 0;
    }

    return gammaFromThreeSides(a, b, c);
}
