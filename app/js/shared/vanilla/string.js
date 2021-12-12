/**
 * // fixme: move to static module?
 * @returns {string}
 */
HC.filePath = function() {
    let args = Array.prototype.slice.call(arguments).filter(v => {
        return v !== null && v !== undefined;
    });
    return args.join('/');
}

/**
 *
 * @param file
 * @returns {{fps: number, tempo: number, resolution: {x: number, y: number}}}
 */
HC.parseFileMeta = function (file) {

    let meta = {
        tempo: 120,
        resolution: {
            x: 1280,
            y: 720
        },
        fps: 30
    };
    let data = file.replace(/^[^\d]+/, '').replace(/\..{3,4}$/, '');

    if (data !== file) {
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
HC.numberExtract = function(item, prefix) {
    let regex = new RegExp(prefix + '(\\d+)_?\\w*');
    let i = item.replace(regex, '$1');
    i = parseInt(i);

    if (!isNaN(i)) {
        return i;
    }

    return undefined;
}

/**
 *
 * @param value
 * @param otype
 * @returns {string|{}|*[]|null|undefined|any|boolean|number}
 */
HC.parse = function (value, otype) {

    if (isString(value) && value.length === 0) {
        return HC.createEmptyOfType(otype);
    }
    else if (value === 'true') {
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

    return value;
}

/**
 *
 * @param args
 * @returns {*}
 */
HC.parseArray = function(args) {
    for (let i in args) {
        let a = args[i];
        args[i] = HC.parse(a);
    }

    return args;
}

/**
 *
 * @param typeName
 * @returns {string|{}|null|*[]|undefined}
 */
HC.createEmptyOfType = function (typeName) {
    switch (typeName) {
        case 'object':
            return {};
        case 'string':
            return '';
        case 'array':
            return [];
        case 'undefined':
            return undefined
        default:
            return null;
    }
}