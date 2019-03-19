/**
 *
 * @param i
 * @returns {*}
 */
function getSampleBySequence(i) {
    var key = getSequenceSampleKey(i);
    var value = statics.SourceSettings[key];

    return value;
}

/**
 *
 * @param i
 * @returns {*}
 */
function getSequenceBySample(i) {
    for (var seq = 0; seq < statics.SourceValues.sequence.length; seq++) {
        var sample = getSampleBySequence(seq);
        if (sample == i) {
            return seq;
        }
    }

    return false;
}

/**
 *
 * @param i
 * @returns {*}
 */
function getSampleEnabledBySequence(i) {
    var s = getSampleBySequence(i);
    var value = getSampleEnabledBySample(s);

    return value;
}

/**
 *
 * @param i
 * @returns {*}
 */
function getSampleEnabledBySample(i) {
    var key = getSampleEnabledKey(i);
    var value = statics.SourceSettings[key];

    return value;
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSequenceKey(i) {
    return 'sequence' + i;
}

/**
 *
 * @param i
 * @returns {string}
 */
function getSampleKey(i) {
    //return i;
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
function getSequenceOverlayKey(i) {
    return getSequenceKey(i) + '_overlay';
}

/**
 *
 * @param i
 * @returns {*}
 */
function getSequenceOverlay(i) {
    var key = getSequenceOverlayKey(i);
    var value = statics.SourceSettings[key];
    return parseInt(value);
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
function getSampleResetKey(i) {
    return getSampleKey(i) + '_reset';
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
 * @returns {boolean}
 */
function getSequenceInUse(i) {
    var enabled = getSampleEnabledBySequence(i);
    if (enabled) {
        var hasparent = getSequenceHasParent(i);
        return hasparent;
    }

    return false;
}

/**
 *
 * @param i
 * @returns {boolean}
 */
function getSequenceHasParent(i) {

    var material = statics.SourceValues.material_map[statics.SourceSettings.material_map];
    var key = getSequenceKey(i);
    if (material == key && renderer) {
        return true;
    }

    for (var dpl = 0; dpl < statics.DisplayValues.display.length; dpl++) {
        var visible = getDisplayVisible(dpl);
        if (visible) {
            var src = getDisplaySource(dpl);
            if (src == 'sequence') {
                var seq = getDisplaySequence(dpl);
                if (seq == i) {
                    return true;
                }
                var ovrly = getSequenceOverlay(seq);
                if (ovrly == i) {
                    return true;
                }

                ovrly = getSequenceOverlay(ovrly);
                if (ovrly == i) {
                    return true;
                }

                ovrly = getSequenceOverlay(ovrly);
                if (ovrly == i) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 *
 * @param i
 * @returns {boolean}
 */
function getSampleHasParent(i) {
    for (var seq = 0; seq < statics.SourceValues.sequence.length; seq++) {
        var sample = getSampleBySequence(seq);
        if (sample == i) {
            return true;
        }
    }

    return false;
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
 * @returns {*}
 */
function getDisplaySequence(i) {
    var key = getDisplaySequenceKey(i);
    var value = statics.SourceSettings[key];
    return value;
}

/**
 *
 * @param i
 * @returns {*}
 */
function getDisplaySource(i) {
    var key = getDisplaySourceKey(i);
    var value = statics.SourceSettings[key];
    return value;
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
 * @returns {*}
 */
function getDisplayVisible(i) {
    var key = getDisplayVisibleKey(i);
    var value = statics.DisplaySettings[key];
    return value;
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

/**
 *
 * @param i
 * @returns {*}
 */
function getSequenceStart(i) {
    var key = getSequenceStartKey(i);
    var value = statics.SourceSettings[key];
    return parseInt(value);
}

/**
 *
 * @param i
 * @returns {*}
 */
function getSequenceEnd(i) {
    var key = getSequenceEndKey(i);
    var value = statics.SourceSettings[key];
    return parseInt(value);
}