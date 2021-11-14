/**
 *
 * @returns {{s: *, h: *, l: *, o: number}}
 */
function randomColor() {

    let vh = randomInt(0, 360);
    let vs = randomInt(50, 100);
    let vl = randomInt(25, 55);

    let no = randomFloat(0.6, 0.9, 2, false);

    return {h: vh, s: vs, l: vl, o: no};
}

/**
 *
 * @param hex
 * @returns {{s, h, l}}
 */
function hexToHsl(hex) {
    let hex3 = /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
    let hex6 = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
    let color = {r: 255, g: 255, b: 255};

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
 *
 * @param color
 * @returns {*}
 */
function rgbToHsl(color) {
    if ('r' in color) {
        let r = color.r;
        let g = color.g;
        let b = color.b;
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
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
 *
 * @param color
 * @returns {{r: number, b: number, g: number}}
 */
function hslToRgb(color) {
    let h = color.h,
        s = color.s,
        l = color.l;
    let r, g, b;

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
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {r: r * 255, g: g * 255, b: b * 255};
}

/**
 *
 * @param color
 * @returns {string}
 */
function hslToHex(color) {
    let c = hslToRgb(color);

    return '#' + rgbToHex(c.r, c.g, c.b);
}

/**
 *
 * @param r
 * @param g
 * @param b
 * @returns {string}
 */
function rgbToHex(r, g, b) {

    let hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16))
    ];

    return hex.join("");
}

/**
 *
 * @param c
 * @returns {string}
 */
function pad2(c) {
    return c.length === 1 ? '0' + c : '' + c;
}

/**
 *
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
 *
 * @param from
 * @param to
 */
function copyHsl(from, to) {
    to.h = from.h;
    to.s = from.s;
    to.l = from.l;
}

/**
 *
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
 *
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
