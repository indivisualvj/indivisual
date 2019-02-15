/**
 *
 * @param source
 * @param target
 * @returns {any}
 */
function _extend(source, target) {
    return Object.assign(Object.create(source.prototype), target);
}

/**
 *
 * @param constructor
 * @param parent
 * @param proto
 */
function _class(constructor, parent, proto) {
    var cls = constructor || function () {
    };
    cls.prototype = _extend(parent || function () {
    }, proto);
    return cls;
}
