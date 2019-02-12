/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {
    /**
     *
     * @constructor
     */
    HC.Beatkeeper = function () {
        this.beatStartTime = 0;
        this.firstTrigger = false;
        this.triggerCounter = 0;
        this.timeout = false;
        this.bpm = 0;
        this.tempo = 120;
        this.tween = new TWEEN.Group();
    };

    HC.Beatkeeper.prototype = {

        speeds: {
            "64": {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 1/64,
                visible: false
            },
            "32": {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 1/32,
                visible: false
            },
            hexa: {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 1/16
            },
            octa: {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 1/8
            },
            quad: {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 1/4
            },
            double: {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 1/2
            },
            full: {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 1
            },
            half: {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 2
            },
            quarter: {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 4
            },
            eight: {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 8
            },
            sixteen: {
                duration: 0,
                progress: 0,
                prc: 1,
                beats: 0,
                divider: 16
            }
        },

        /**
         *
         * @param speed
         * @private
         */
        _tween: function (speed) {
            var inst = this;
            var next = {prc: 1, progress: speed.duration};

            var tween = new TWEEN.Tween(speed, this.tween);
            tween.to(next, speed.duration);
            tween.onComplete(function (speed) {
                speed.prc = 0;
                speed.progress = 0;
                speed.beats++;

                var full = 60000 / inst.tempo * 4;
                var duration = full / speed.divider;
                var beats = speed.beats;
                var elapsed = HC.now() - (inst.beatStartTime);
                var estimated = duration * beats;
                var offset = elapsed - estimated;

                speed.pitch = offset;
                speed.duration = clamp(duration - offset, duration * .85, duration * 1.15);

                if (DEBUG && Math.abs(offset) > duration && speed.divider == 4) {
                    console.log(
                        inst.speeds.eight.pitch.toFixed(2),
                        inst.speeds.quarter.pitch.toFixed(2),
                        inst.speeds.half.pitch.toFixed(2),
                        inst.speeds.full.pitch.toFixed(2),
                        inst.speeds.double.pitch.toFixed(2)
                    );
                }

                inst._tween(speed);
            });

            tween.start();
        },

        /**
         *
         */
        resetTrigger: function () {
            clearTimeout(this.timeout);
            this.firstTrigger = false;
            this.triggerCounter = 0;
            this.timeout = false;
        },

        /**
         * §
         * @param value
         * @param override
         * @param speed
         * @param forward
         * @returns {boolean|*|statics.ControlSettings.beat}
         */
        trigger: function (value, override, speed, forward) {

            var inst = this;

            if (this.timeout) { // following trigger
                clearTimeout(this.timeout);
                var diff = HC.now() - this.firstTrigger;
                var bpm = this.triggerCounter / (diff / 60000);

                statics.ControlSettings.beat = true;
                this.triggerCounter++;

                this.timeout = setTimeout(function () {
                    inst.resetCounters(inst.firstTrigger);
                    inst.resetTrigger();
                }, 1333);

                if (forward) {
                    statics.ControlSettings.tempo = bpm;
                    messaging.emitControls({tempo: bpm}, true, false);

                } else {
                    messaging.emitControls({tempo: bpm}, true, false);
                }

            } else { // first trigger
                var bst = HC.now();
                this.firstTrigger = bst;
                this.triggerCounter++;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    statics.ControlSettings.beat = value;
                    inst.resetTrigger();
                }, 1333);
            }

            return statics.ControlSettings.beat;
        },

        /**
         *
         * @param firstPeak
         * @param peakBpm
         * @param speed
         * @param latency
         * @returns {boolean}
         */
        speedByPeakBpm: function (firstPeak, peakBpm, speed) {
            var nuSpeed = false;

            var prc = peakBpm / speed * 100;
            var prcH = (peakBpm / 2) / speed * 100;
            var prcD = (peakBpm * 2) / speed * 100;

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
        },

        /**
         *
         * @param rhythm
         * @returns {boolean}
         */
        getSpeed: function (rhythm) {
            
            var speed = false;

            if (rhythm in this.speeds) {
                speed = this.speeds[rhythm];

            } else {
                speed = this.getDefaultSpeed();
            }

            return speed;
        },

        /**
         *
         * @returns {boolean}
         */
        getDefaultSpeed: function () {
            return this.getSpeed('quarter');
        },

        /**
         *
         * @param diff
         * @param tempo
         */
        updateSpeeds: function (diff, tempo) {

            var dflt = this.getDefaultSpeed();
            if (dflt.prc == 0) {
                this.updatePitch(tempo);
            }

            this.tempo = tempo;
            this.tween.update(HC.now(), false);

        },

        /**
         *
         * @param speed
         * @param repeat
         */
        updatePitch: function (speed, repeat) {
            var unit = this.getDefaultSpeed();
            var duration = 60000 / speed;
            var beats = unit.beats;
            var elapsed = HC.now() - (this.beatStartTime);
            var estimated = duration * beats;
            var offset = elapsed - estimated;
            var offbeat = Math.abs(offset) > duration;

            if (offbeat && !repeat) {
                var add = Math.round(offset / duration);
                this.beatStartTime += add * duration;
                this.updatePitch(speed, true);

                return;
            }

            var bpm = beats / (elapsed / 60000);
            this.bpm  = round(bpm, 2);
        },

        /**
         *
         * @param beatStartTime
         */
        resetCounters: function (beatStartTime) {
            this.beatStartTime = beatStartTime;
            var duration = 60000 / statics.ControlSettings.tempo;
            var elapsed = HC.now() - this.beatStartTime;
            var ebeats  = Math.floor((elapsed / duration) / 4);

            // _log('resetCounters', {ebeats:ebeats}, false, DEBUG);

            for (var s in this.speeds) {
                s = this.speeds[s];
                var beats = ebeats * s.divider;
                s.beats = beats;
            }
        },

        /**
         *
         */
        reset: function () {
            this.resetCounters(HC.now());
            this.resetTrigger();
        },

        /**
         *
         * @param rhythm
         * @returns {number}
         */
        rhythmDivider: function (rhythm) {
            return this.speeds[rhythm].divider;
        },

        /**
         * @deprecated
         * @param rhythm
         * @returns {boolean}
         */
        rhythmSlow: function (rhythm) {
            return rhythm != 1;
        },


        /**
         *
         */
        stop: function () {
            this.tween.removeAll();
        },

        /**
         *
         */
        play: function () {
            for (var key in this.speeds) {
                var s = this.speeds[key];
                s.pitch = 0;
                this._tween(s);
            }
        }
    }
})();
