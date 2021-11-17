
/**
 *
 * @param i
 * @returns {string}
 */
function getSequenceKey(i) {
    if (isString(i)) {
        return i;
    }

    return 'sequence' + i;
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSampleKey(i) {
    return 'sample' + i;
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSequenceSampleKey(i) {
    return getSequenceKey(i) + '_input';
}


/**
 *
 * @param i
 * @returns {string}
 */
function getSampleEnabledKey(i) {
    return getSampleKey(i) + '_enabled';
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSampleRecordKey(i) {
    return getSampleKey(i) + '_record';
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSampleBeatKey(i) {
    return getSampleKey(i) + '_beats';
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSampleStoreKey(i) {
    return getSampleKey(i) + '_store';
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSampleLoadKey(i) {
    return getSampleKey(i) + '_load';
}

/**
 *
 * @param i
 * @returns {string}
 */
function getDisplayVisibleKey(i) {
    return getDisplayKey(i) + '_visible';
}

/**
 *
 * @param i
 * @returns {string}
 */
function getDisplaySourceKey(i) {
    return getDisplayKey(i) + '_source';
}

/**
 *
 * @param i
 * @returns {string}
 */
function getDisplaySequenceKey(i) {
    return getDisplayKey(i) + '_sequence';
}


/**
 *
 * @param i
 * @returns {string}
 */
function getDisplayKey(i) {
    return 'display' + i;
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSequenceStartKey(i) {
    return getSequenceKey(i) + '_start';
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSequenceEndKey(i) {
    return getSequenceKey(i) + '_end';
}
