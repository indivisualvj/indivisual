JSON.copy = function (object) {
    return JSON.parse(JSON.stringify(object, null, 4));
};