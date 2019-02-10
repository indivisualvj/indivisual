HC.Osci = {

    /**
     *
     * @param prc
     * @param add
     * @returns {*}
     */
    linInOut: function (prc, add) {
        return (add || 0) + 2 * (prc > .5 ? 1 - prc : prc);
    },

    /**
     *
     * @param prc
     * @param add
     */
    sinInOut: function (prc, add) {
        return (add || 0) + this.sinus(prc) / 2 + .5;
    },

    /**
     *
     * @param prc
     * @param add
     */
    cosInOut: function (prc, add) {
        return (add || 0) + this.cosinus(prc) / 2 + .5;
    },

    /**
     *
     * @param offset
     * @param settings
     * @returns {number}
     */
    reverse: function (offset, settings) {
        var bpm = 180 / statics.ControlSettings.tempo * 1000;
        var div = beatkeeper.getSpeed(settings.rhythm).divider / 8;
        var progress = Math.PI * animation.last / (bpm * settings.osci1_period);
        progress *= div;

        return Math.sin(offset + progress);
    },

    /**
     *
     * @param prc
     * @param add
     * @returns {*}
     */
    sinus: function (prc, add) {
        var p = Math.PI * 2 * prc;
        p = Math.sin(p);

        return (add || 0) + p;
    },

    /**
     *
     * @param prc
     * @param add
     * @returns {*}
     */
    cosinus: function (prc, add) {
        var p = Math.PI * 2 * prc;
        p = Math.cos(p);

        return (add || 0) + p;
    },

    /**
     *
     * @param pa
     * @param steps
     * @param speed
     * @param onpeak
     * @param negative
     */
    step: function (pa, steps, speed, onpeak, negative) {
        if ((onpeak && audio.peak) || (!onpeak && speed.prc == 0)) {
            var n = pa.next;
            while (n == pa.next) {
                n = (randomInt(0, steps, negative) / steps);
            }
console.log(n, pa);
            pa.next = n;
            if (pa.next > 1) debug;
        }

        var diff = pa.next - pa.value;

        if (Math.abs(diff) > 0.01) {
            var step = diff / 0.075 * animation.diff / (speed.duration * 2);
            pa.value += step;
        }
    },

    /**
     *
     * @param progress
     * @param settings
     * @returns {number}
     */
    wobble: function (progress, settings) {
        var p = 1;

        var bpm = 60000 / statics.ControlSettings.tempo;
        var div = beatkeeper.rhythmDivider(settings.rhythm) / 2;
        progress = progress || Math.PI * animation.now;

        if (settings.osci1_period !== 0) {
            var pr = progress / (bpm * settings.osci1_period);
            pr *= div;
            p = settings.osci1_amp * Math.sin(pr);
        }
        if (settings.osci2_period !== 0) {
            var pr = progress / (bpm * settings.osci2_period);
            pr *= div;
            p += settings.osci2_amp * Math.sin(pr);
        }
        if (settings.osci3_period !== 0) {
            var pr = progress / (bpm * settings.osci3_period);
            pr *= div;
            p += settings.osci3_amp * Math.sin(pr);
        }

        return p;
    }
};