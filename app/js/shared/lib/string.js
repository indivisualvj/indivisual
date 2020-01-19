/**
 * splitToIntArray
 * @param value
 * @returns {*}
 */
function splitToIntArray(value) {

    if (value && isString(value)) {
        let arr = value.split(',');
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
 * filePath
 * @returns {string}
 */
function filePath() {
    let args = Array.prototype.slice.call(arguments);
    return args.join('/');
}

/**
 * parseFileMeta
 * @param file
 * @returns {{fps: number, resolution: {x: number, y: number}, speed: number}}
 */
function parseFileMeta(file) {

    let meta = {
        tempo: 120,
        resolution: {
            x: 1280,
            y: 720
        },
        fps: 30
    };
    let data = file.replace(/^[^\d]+/, '').replace(/\..{3,4}$/, '');

    if (data != file) {
        data = data.split(',');

        meta.tempo = parseInt(data[0]);
        if (data.length > 1) {
            if (data[1].match(/\d+x\d+/)) {
                let res = data[1].split('x');
                meta.resolution.x = parseInt(res[0]);
                meta.resolution.y = parseInt(res[1]);
            }

            if (data.length > 2) {
                meta.fps = parseInt(data[2]);
            }
        }

    }

    return meta;
}

/**
 *
 * @param item
 * @param prefix
 * @returns {*}
 */
function numberExtract(item, prefix) {
    let regex = new RegExp(prefix + '(\\d+)');
    let i = item.replace(regex, '$1');
    i = parseInt(i);

    if (!isNaN(i)) {
        return i;
    }

    return undefined; // todo does it still work with all use cases?
}

/**
 *
 * @param value
 * @returns {*}
 */
function parse(value, fallback) {
    if (value === 'true') {
        return true;

    } else if (value === 'false') {
        return false;

    } else if (value.match(/^\d+$/)) {
        return parseInt(value);

    } else if (value.match(/^\d+\.\d+$/)) {
        return parseFloat(value);

    } else if (value.match(/{.+}/)) {
        return JSON.parse(value);
    }

    return fallback !== undefined ? fallback : value;
}

/**
 *
 * @param args
 * @returns {*}
 */
function parseArray(args) {
    for (let i in args) {
        let a = args[i];
        args[i] = parse(a);
    }

    return args;
}
