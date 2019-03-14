/**
 * todo HC.
 * @returns {{s: *, h: *, l: *, o: number}}
 */
function randomColor() {

    var vh = randomInt(0, 360);
    var vs = randomInt(50, 100);
    var vl = randomInt(25, 55);

    var no = randomFloat(0.6, 0.9, 2, false);

    return {h: vh, s: vs, l: vl, o: no};
}

/**
 * todo HC.
 * @param hex
 * @returns {{s, h, l}}
 */
function hexToHsl(hex) {
    var hex3 = /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
    var hex6 = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
    var color = {r: 255, g: 255, b: 255};

    hex = hex.substr(1);
    if ((match = hex6.exec(hex))) {
        color = {
            r: parseInt(match[1], 16),
            g: parseInt(match[2], 16),
            b: parseInt(match[3], 16)
        };
    }
    if ((match = hex3.exec(hex))) {
        color = {
            r: parseInt(match[1] + '' + match[1], 16),
            g: parseInt(match[2] + '' + match[2], 16),
            b: parseInt(match[3] + '' + match[3], 16)
        };
    }

    return rgbToHsl(color);
}

/**
 * todo HC.
 * @param color
 * @returns {*}
 */
function rgbToHsl(color) {
    if ('r' in color) {
        var r = color.r;
        var g = color.g;
        var b = color.b;
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return {h: h * 360, s: s * 100, l: l * 100};
    }

    return color;
}

/**
 * todo HC.
 * @param color
 * @returns {{r: number, b: number, g: number}}
 */
function hslToRgb(color) {
    var h = color.h,
        s = color.s,
        l = color.l;
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {r: r * 255, g: g * 255, b: b * 255};
}

/**
 * todo HC.
 * @param color
 * @returns {string}
 */
function hslToHex(color) {
    var c = hslToRgb(color);

    return '#' + rgbToHex(c.r, c.g, c.b);
}

/**
 * todo HC.
 * @param r
 * @param g
 * @param b
 * @returns {string}
 */
function rgbToHex(r, g, b) {

    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16))
    ];

    return hex.join("");
}

/**
 * todo HC.
 * @param c
 * @returns {string}
 */
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

/**
 * todo HC.
 * @param hsl
 * @returns {*}
 */
function hslComplementary(hsl) {
    hsl = Object.assign({}, hsl);
    hsl.s = 100;
    hsl.l = 50;
    hsl.h = (hsl.h + 180) % 360;

    return hsl;
}

/**
 * todo HC.
 * @param from
 * @param to
 */
function copyHsl(from, to) {
    to.h = from.h;
    to.s = from.s;
    to.l = from.l;
}

/**
 * todo HC.
 * @param p
 * @param q
 * @param t
 * @returns {*}
 */
function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

/**
 * todo HC.
 * @param n
 * @param max
 * @returns {number}
 */
function bound01(n, max) {
    n = Math.min(max, Math.max(0, n));

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / max;
}
