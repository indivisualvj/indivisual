/**
 * todo HC.splitToIntArray
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
 * todo HC.filePath
 * @returns {string}
 */
function filePath() {
    var args = Array.prototype.slice.call(arguments);
    return args.join('/');
}

/**
 * todo HC.parseFileMeta
 * @param file
 * @returns {{fps: number, resolution: {x: number, y: number}, speed: number}}
 */
function parseFileMeta(file) {

    var meta = {
        tempo: 120,
        resolution: {
            x: 1280,
            y: 720
        },
        fps: 30
    };
    var data = file.replace(/^[^\d]+/, '').replace(/\..{3,4}$/, '');

    if (data != file) {
        data = data.split(',');

        meta.tempo = parseInt(data[0]);
        if (data.length > 1) {
            if (data[1].match(/\d+x\d+/)) {
                var res = data[1].split('x');
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
    var regex = new RegExp(prefix + '(\\d+)');
    var i = item.replace(regex, '$1');
    i = parseInt(i);

    if (!isNaN(i)) {
        return i;
    }

    return item;
}

/**
 * todo HC.
 * @param value
 * @returns {*}
 */
function parse(value) {
    if (value === 'true') {
        return true;

    } else if (value === 'false') {
        return false;

    } else if (value.match(/^\d+$/)) {
        return parseInt(value);

    } else if (value.match(/^\d+\.\d+$/)) {
        return parseFloat(value);
    }

    return value;
}

/**
 * todo HC.
 * @param args
 * @returns {*}
 */
function parseArray(args) {
    for (var i in args) {
        var a = args[i];
        args[i] = parse(a);
    }

    return args;
}