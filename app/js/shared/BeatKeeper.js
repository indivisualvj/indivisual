/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
class BeatKeeper {

    beatStartTime = 0;
    firstTrigger = false;
    triggerCounter = 0;
    timeout = false;
    bpm = 0;
    tempo = 120;

    /**
     * @type {function}
     */
    now;

    /**
     * @type {TWEEN.Group}
     */
    tween;

    /**
     * @type {Config}
     */
    config;

    /**
     *
     * @type {Object.<string, HC.Speed>}
     */
    speeds = BeatKeeper.initSpeeds();

    /**
     *
     * @param {function} now
     * @param {Config} config
     */
    constructor(now, config) {
        this.now = now;
        this.config = config;
        this.tween = new TWEEN.Group();
    }

    /**
     *
     * @param speed
     * @private
     */
    _tween(speed) {
        let next = {prc: 1, progress: speed.duration};

        let tween = new TWEEN.Tween(speed, this.tween);
        tween.to(next, speed.duration);
        tween.onComplete((speed) => {
            speed.prc = 0;
            speed.progress = 0;
            speed.beats++;

            let full = 60000 / this.tempo * 4;
            let duration = full / speed.divider;
            let beats = speed.beats;
            let elapsed = this.now() - this.beatStartTime;
            let estimated = duration * beats;
            let offset = elapsed - estimated;

            speed.pitch = offset;
            speed.duration = clamp(duration - offset, duration * .85, duration * 1.15);

            // if (DEBUG && Math.abs(offset) > duration && speed.divider === 4) {
            //     console.log(
            //         this.speeds.eight.pitch.toFixed(2),
            //         this.speeds.quarter.pitch.toFixed(2),
            //         this.speeds.half.pitch.toFixed(2),
            //         this.speeds.full.pitch.toFixed(2),
            //         this.speeds.double.pitch.toFixed(2)
            //     );
            // }

            this._tween(speed);
        });

        tween.start();
    }

    /**
     *
     */
    resetTrigger() {
        clearTimeout(this.timeout);
        this.firstTrigger = false;
        this.triggerCounter = 0;
        this.timeout = false;
    }

    /**
     *
     * @param value
     * @returns {boolean}
     */
    trigger(value) {

        if (this.timeout) { // following trigger
            clearTimeout(this.timeout);
            let diff = HC.now() - this.firstTrigger;
            let bpm = this.triggerCounter / (diff / 60000);

            this.triggerCounter++;

            this.config.ControlSettings.beat = true;

            this.timeout = setTimeout(() => {
                this.resetCounters(this.firstTrigger);
                this.resetTrigger();
            }, 1333);

            messaging.program.updateControl('tempo', bpm, true, false, false);

        } else { // first trigger
            this.firstTrigger = HC.now();
            this.triggerCounter++;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.config.ControlSettings.beat = value;
                this.resetTrigger();
            }, 1333);
        }

        return this.config.ControlSettings.beat;
    }

    /**
     *
     * @param firstPeak
     * @param peakBpm
     * @param speed
     * @returns {boolean}
     */
    speedByPeakBpm(firstPeak, peakBpm, speed) {
        let nuSpeed = false;

        let prc = peakBpm / speed * 100;
        let prcH = (peakBpm / 2) / speed * 100;
        let prcD = (peakBpm * 2) / speed * 100;

        if (prc > 99.9 && prc < 100.1) {
            nuSpeed = false; // speed seems to be ok
            // resetCounters to firstPeak ?

        } else if (prc > 75 && prc < 125) {
            this.resetCounters(firstPeak);
            nuSpeed = peakBpm;

        } else if (prcH > 75 && prcH < 125) {
            this.resetCounters(firstPeak);
            nuSpeed = peakBpm / 2;

        } else if (prcD > 75 && prcD < 125) {
            this.resetCounters(firstPeak);
            nuSpeed = peakBpm * 2;
        }

        return nuSpeed;
    }

    /**
     *
     * @param rhythm
     * @returns {HC.Speed}
     */
    getSpeed(rhythm) {

        let speed = false;

        if (rhythm in this.speeds) {
            speed = this.speeds[rhythm];

        } else {
            throw new Error('rhythm ' + rhythm + ' not found!');
            // speed = this.getDefaultSpeed();
        }

        return speed;
    }

    /**
     *
     * @returns {HC.Speed}
     */
    getDefaultSpeed() {
        return this.getSpeed('quarter');
    }

    /**
     *
     * @param diff
     * @param tempo
     */
    updateSpeeds(diff, tempo) {

        let dflt = this.getDefaultSpeed();
        if (dflt.starting()) {
            this.updatePitch(tempo);
        }

        this.tempo = tempo;
        this.tween.update(this.now(), false);

    }

    /**
     *
     * @param speed
     * @param repeat
     */
    updatePitch(speed, repeat) {
        let unit = this.getDefaultSpeed();
        let duration = 60000 / speed;
        let beats = unit.beats;
        let elapsed = this.now() - (this.beatStartTime);
        let estimated = duration * beats;
        let offset = elapsed - estimated;
        let offbeat = Math.abs(offset) > duration;

        if (offbeat && !repeat) {
            let add = Math.round(offset / duration);
            this.beatStartTime += add * duration;
            this.updatePitch(speed, true);

            return;
        }

        let bpm = beats / (elapsed / 60000);
        this.bpm = round(bpm, 2);
    }

    /**
     *
     * @param beatStartTime
     */
    resetCounters(beatStartTime) {
        this.beatStartTime = beatStartTime;
        let duration = 60000 / this.config.ControlSettings.tempo;
        let elapsed = HC.now() - this.beatStartTime;
        let ebeats = Math.floor((elapsed / duration) / 4);

        // HC.log('resetCounters', {ebeats:ebeats}, false, DEBUG);

        for (let s in this.speeds) {
            s = this.speeds[s];
            s.beats = ebeats * s.divider;
        }
    }

    /**
     *
     */
    reset() {
        this.resetCounters(this.now());
        this.resetTrigger();
    }

    /**
     *
     * @param rhythm
     * @returns {number}
     */
    rhythmDivider(rhythm) {
        return this.speeds[rhythm].divider;
    }

    /**
     * @deprecated
     * @param rhythm
     * @returns {boolean}
     */
    rhythmSlow(rhythm) {
        return rhythm !== 1;
    }

    /**
     *
     */
    stop() {
        this.tween.removeAll();
    }

    /**
     *
     */
    play() {
        for (let key in this.speeds) {
            let s = this.speeds[key];
            s.pitch = 0;
            this._tween(s);
        }
    }

    static initSpeeds() {
        return {
            "64": new Speed(1 / 64, false),
            "32": new Speed(1 / 32, false),
            hexa: new Speed(1 / 16, true),
            octa: new Speed(1 / 8, true),
            quad: new Speed(1 / 4, true),
            double: new Speed(1 / 2, true),
            full: new Speed(1, true),
            half: new Speed(2, true),
            quarter: new Speed(4, true),
            eight: new Speed(8, true),
            sixteen: new Speed(16, true)
        };
    }
}

class Speed {
    duration = 0;
    progress = 0;
    prc = 1;
    beats = 0;
    divider;
    visible = true;

    constructor(divider, visible) {
        this.divider = divider;
        this.visible = visible;
    }

    starting() {
        return this.prc === 0;
    }
}

export {BeatKeeper, Speed}
