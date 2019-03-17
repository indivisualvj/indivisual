HC.Osci = {

    /**
     *
     * @param prc
     * @param add
     * @returns {*}
     */
    linInOut(prc, add) {
        return (add || 0) + 2 * (prc > .5 ? 1 - prc : prc);
    },

    /**
     *
     * @param prc
     * @param add
     */
    sinInOut(prc, add) {
        return (add || 0) + this.sinus(prc) / 2 + .5;
    },

    /**
     *
     * @param prc
     * @param add
     */
    cosInOut(prc, add) {
        return (add || 0) + this.cosinus(prc) / 2 + .5;
    },

    /**
     *
     * @param offset
     * @param settings
     * @returns {number}
     */
    reverse(offset, settings) {
        let bpm = 180 / statics.ControlSettings.tempo * 1000;
        let div = beatkeeper.getSpeed(settings.rhythm).divider / 8;
        let progress = Math.PI * animation.last / (bpm * settings.osci1_period);
        progress *= div;

        return Math.sin(offset + progress);
    },

    /**
     *
     * @param prc
     * @param add
     * @returns {*}
     */
    sinus(prc, add) {
        let p = Math.PI * 2 * prc;
        p = Math.sin(p);

        return (add || 0) + p;
    },

    /**
     *
     * @param prc
     * @param add
     * @returns {*}
     */
    cosinus(prc, add) {
        let p = Math.PI * 2 * prc;
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
    step(pa, steps, speed, onpeak, negative) {
        if ((onpeak && audio.peak) || (!onpeak && speed.prc == 0)) {
            let n = pa.next;
            while (n == pa.next) {
                n = (randomInt(0, steps, negative) / steps);
            }

            pa.next = n;
            if (pa.next > 1) debug;
        }

        let diff = pa.next - pa.value;

        if (Math.abs(diff) > 0.01) {
            let step = diff / 0.075 * animation.diff / (speed.duration * 2);
            pa.value += step;
        }
    },

    /**
     *
     * @param progress
     * @param settings
     * @param func
     * @returns {number}
     */
    wobble(progress, settings, func) {
        let p = 1;

        let bpm = 60000 / statics.ControlSettings.tempo;
        let div = beatkeeper.rhythmDivider(settings.rhythm) / 2;
        func = func || Math.sin;
        progress = progress || Math.PI * animation.now;

        if (settings.osci1_period !== 0) {
            let pr = progress / (bpm * settings.osci1_period);
            pr *= div;
            p = settings.osci1_amp * func(pr);
        }
        if (settings.osci2_period !== 0) {
            let pr = progress / (bpm * settings.osci2_period);
            pr *= div;
            p += settings.osci2_amp * func(pr);
        }
        if (settings.osci3_period !== 0) {
            let pr = progress / (bpm * settings.osci3_period);
            pr *= div;
            p += settings.osci3_amp * func(pr);
        }

        return p;
    }
};