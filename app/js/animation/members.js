/**
 * Keep in mind: If durations in HC.Beatkeeper.speeds change due to pitching, this will not return usable values for smooth animations.
 * @param duration
 * @param divider
 * @returns {number}
 */
HC.Animation.prototype.getFrameDurationPercent = function (duration, divider) {
    return this.diffPrc * this.duration / (duration * (divider || 1));
};

/**
 *
 * @param recursions
 * @returns {*}
 */
HC.Animation.prototype.shuffleLayer = function (recursions) {
    // reduce to shuffleable / or not
    var shuffleable = (statics.ControlSettings.shuffleable && (statics.ControlSettings.shuffleable.length > 0)) ? true : false;
    var pile = shuffleable ? splitToShuffleable(statics.ControlSettings.shuffleable) : statics.ControlValues.layer;
    var position = Math.max(0, pile.indexOf(statics.ControlSettings.layer));

    if (Math.abs(recursions) > pile.length - 1) {
        return;
    }

    if (recursions === undefined) {
        recursions = 0;
    }

    var i = randomInt(0, pile.length - 1); // random
    var dir = 1;
    if (statics.ControlSettings.shuffle_mode == 0) { // forward
        i = position + recursions + 1;

    } else if (statics.ControlSettings.shuffle_mode == 1) { // reversed
        i = position + recursions - 1;
        dir = -1;
    }

    if (i > pile.length - 1) {
        i -= pile.length;

    } else if (i < 0) {
        i = pile.length + recursions - 1;
    }

    if (shuffleable) {
        i = pile[i];
    }

    if (renderer.layers[i].settings
        && !renderer.layers[i].settings.isDefault()
        && i != statics.ControlSettings.layer
    //&& layerShuffleable(i)
    ) {
        this.updateControl('layer', i, true, false, false);
        return true;

    } else if (recursions < pile.length) {
        return this.shuffleLayer(recursions + dir);
    }
};

/**
 *
 */
HC.Animation.prototype.doShuffle = function () { // todo plugins
    var beats = beatkeeper.getDefaultSpeed().beats;
    var diff = Math.abs(beats - statics.shuffle.beats.last);
    statics.shuffle.beats.last = beats;
    statics.shuffle.beats.counter += diff;

    if (statics.ControlSettings.shuffle) {
        if (!statics.ControlSettings.shuffle_usepeak) { // shuffle by beatcount

            if (statics.shuffle.beats.counter >= statics.ControlSettings.shuffle_switch_every) {
                this.shuffleLayer(0);
            }

        } else if (audio.peak
            && audio.peakCount > 0
            && audio.peakCount >= statics.ControlSettings.shuffle_switch_every
        ) {
            audio.peakCount = 0;
            this.shuffleLayer(0);
        }
    }

    if (statics.shuffle.beats.counter >= statics.ControlSettings.shuffle_switch_every) {

        if (statics.DisplaySettings.display_visibility == 'randomall') {
            var k = Object.keys(statics.DisplayValues.display_visibility);
            var c = randomInt(1, k.length - 2);
            statics.display.visibility.random = k[c];

        } else {
            statics.display.visibility.random = false;
        }

        if (statics.DisplaySettings.border_mode == 'randomall') {
            var k = Object.keys(statics.DisplayValues.border_mode);
            var c = randomInt(1, k.length - 2);
            statics.display.border.random = k[c];

        } else {
            statics.display.random = false;
        }
    }

    if (statics.shuffle.beats.counter >= statics.ControlSettings.shuffle_switch_every) {
        statics.shuffle.beats.counter = 0;
    }
};