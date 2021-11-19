/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.AudioAnalyser = class AudioAnalyser {

        /**
         *
         * @type {number}
         */
        lastVolume = 0;
        /**
         *
         * @type {Array}
         */
        peakData = [];

        /**
         * @type {Object}
         */
        frequencyRange = {
            bass: [20, 140],
            lowMid: [140, 400],
            mid: [400, 2600],
            highMid: [2600, 5200],
            treble: [5200, 14000],
        };

        /**
         *
         * @type {number}
         */
        peakThresholdStart = 1.2;
        /**
         *
         * @type {number}
         */
        peakThresholdEnd = 3.6;


        /**
         * @type {number}
         */
        binCount; //1024

        /**
         * @type {AnalyserNode}
         */
        analyser;

        /**
         *
         * @type {number}
         */
        peakBPM = 0;
        /**
         *
         * @type {boolean}
         */
        peakReliable = false;
        /**
         *
         * @type {boolean}
         */
        peak = false;
        /**
         *
         * @type {number}
         */
        firstPeak = 0;
        /**
         *
         * @type {Array}
         */
        volumes = [];

        /**
         * @type {number}
         */
        peakThreshold;
        /**
         *
         * @type {number}
         */
        volumeSum = 0;
        /**
         *
         * @type {number}
         */
        volumeCount = 0;

        /**
         *
         * @type {number}
         */
        minPeakReliable = 2;
        /**
         *
         * @type {number}
         */
        lastPeak = 0;

        /**
         *
         * @type {Uint8Array}
         */
        freqData;

        /**
         *
         * @type {Uint8Array}
         */
        domainData;

        /**
         * @type {HC.Animation}
         */
        animation;

        /**
         *
         * @param {HC.Animation} animation
         */
        constructor(animation) {
            this.animation = animation;
            this.peakThreshold = this.peakThresholdStart
        }

        /**
         *
         */
        createAnalyser(context) {
            this.analyser = context.createAnalyser();
            this.analyser.smoothingTimeConstant = .6;
            this.analyser.fftSize = 1024;
            this.binCount = this.analyser.frequencyBinCount / 2; // (... / 2) fixes: last volumes are always zero bug
            this.volumes = new Array(this.binCount).fill(0);

            this.freqData = new Uint8Array(this.binCount);
            this.domainData = new Uint8Array(this.binCount);

            return this.analyser;
        }

        /**
         *
         * @param config
         */
        update(config) {

            let useWaveform = config.useWaveform;
            if (useWaveform) {
                this.analyser.getByteTimeDomainData(this.domainData);
            }

            this.analyser.getByteFrequencyData(this.freqData);

            this.lastVolume = this.volume;

            let values = 0;

            // get all the frequency amplitudes
            for (let i = 0; i < this.binCount; i++) {

                let val = this.freqData[i] / 256;
                let fbdv = useWaveform ? (this.domainData[i] / 256) : val;
                values += val;
                let last = this.volumes[i];
                let v = fbdv * config.volume;

                if (!useWaveform && config.thickness && last > v) {
                    let reduce = (.1 - (.1 * config.thickness)) * this.animation.diffPrc;
                    v = Math.max(v, last - reduce);
                    this.volumes[i] = v;

                } else {
                    this.volumes[i] = (v + last) / 2;  // make it softer
                }
            }

            this.volume = (values / this.binCount) * config.volume;

            this._beatRecognition(config);

            this.volume = (this.volume + this.lastVolume) / 2; // make it softer

             this.volumeSum += this.volume;
            this.volumeCount++;

            if (this.volumeCount >= 60) {
                this.avgVolume =  this.volumeSum / this.volumeCount;
                 this.volumeSum = this.avgVolume;
                this.volumeCount = 1;
            }
        }

        /**
         *
         * @param config
         * @private
         */
        _beatRecognition(config) {
            let now = config.now;
            let diff = now - this.lastPeak;

            if (this.peakThreshold < this.peakThresholdStart) {
                this.peakThreshold = this.peakThresholdStart;

            } else if (this.peakThreshold > this.peakThresholdEnd) {
                this.peakThreshold = this.peakThresholdEnd;
            }

            let stepNow = this.volume / this.lastVolume;

            if (stepNow > this.peakThreshold && this.volume > 0.1 && diff > config.minDiff) {
                this.peak = true;

                // add this.peakData
                let i = this.peakData.length;
                this.peakData[i] = {time: now, volume: this.volume};
                this.lastPeak = now;

                // calculate BPM
                if (i > this.minPeakReliable) {
                    this.firstPeak = this.peakData[i - this.minPeakReliable].time;
                    let timespan = this.lastPeak - this.firstPeak;
                    this.peakBPM = round(60000 / (timespan / this.minPeakReliable), 3);
                    this.peakReliable = 0;

                    let avgDiff = 60000 / this.peakBPM;

                    for (let pi = i - this.minPeakReliable; pi < i; pi++) {
                        let a = this.peakData[pi - 1];
                        let b = this.peakData[pi];
                        let d = b.time - a.time;
                        let prc = (avgDiff / d) * 100;

                        if (prc < 96 || prc > 104) {
                            if (this.peakReliable < this.minPeakReliable) {

                                // reduce minPR to try with smaller datasets
                                if (this.minPeakReliable > 4) {
                                    this.minPeakReliable--;
                                }
                                this.peakReliable = false;

                            } else {
                            }

                            break;
                        }

                        this.peakReliable++;

                    }

                    // reset minPR if peak is reliable
                    if (this.peakReliable) {
                        this.minPeakReliable = 16;
                    }

                    // reset after 128 or if peak is reliable
                    if (i >= 128 || this.peakReliable) {
                        this.peakData = [];
                    }

                    // adjust this.peakThreshold based on found peakBPM and designated speed
                    let prc = (config.speed / this.peakBPM) * 100;
                    if (prc > 200) {
                        this.peakThreshold -= 0.10;

                    } else if (prc > 102) {
                        this.peakThreshold -= 0.05;

                    } else if (prc < 50) {
                        this.peakThreshold += 0.10;

                    } else if (prc < 98) {
                        this.peakThreshold += 0.05;
                    }
                }

                // adjust this.peakThreshold based on found peakBPM and designated speed
                if (this.peakBPM < config.speed / 2) {
                    this.peakThreshold -= 0.10;

                } else if (this.peakBPM > config.speed * 2) {
                    this.peakThreshold += 0.05;
                }

            } else {
                this.peak = false;

                // did not find a peak for a long time adjust this.peakThreshold
                if (diff > config.minDiff * 16) {
                    this.lastPeak = now;

                    this.peakThreshold -= 0.10;
                }
            }
        }

        /**
         *
         * @param speeds
         */
        fakeVolume(speeds) {
            let v = 0;
            let i = 0;
            let m = HC.Osci.sinInOut(speeds['quarter'].prc) / 2.2;
            for (let k in speeds) {
                let prc = speeds[k].prc * 600;
                let w = m / ++i;
                v += w * HC.Osci.sinInOut(prc);
            }

            let last = this.volume || .1;
            let reduce = (.1 - (.1 * .8)) * this.animation.diffPrc;
            v = Math.max(v, last - reduce);
            this.volume = v;
            this.volumes = [this.volume];
        }

        /**
         *
         * @param {number} index
         * @returns {number}
         */
        getVolume(index) {
            let i = index % this.volumes.length;
            return this.volumes[i];
        }

        getFrequencyRangeValue(_frequencyRange) {
            const nyquist = 48000 / 2;
            const lowIndex = Math.round(_frequencyRange[0] / nyquist * this.volumes.length);
            const highIndex = Math.round(_frequencyRange[1] / nyquist * this.volumes.length);
            let total = 0;
            let numFrequencies = 0;

            for (let i = lowIndex; i <= highIndex; i++) {
                total += this.volumes[i];
                numFrequencies += 1;
            }
            return total / numFrequencies;
        }

        getFrequencyRangeValues() {
            return [
                this.getFrequencyRangeValue(this.frequencyRange.bass),
                this.getFrequencyRangeValue(this.frequencyRange.lowMid),
                this.getFrequencyRangeValue(this.frequencyRange.mid),
                this.getFrequencyRangeValue(this.frequencyRange.highMid),
                this.getFrequencyRangeValue(this.frequencyRange.treble),
            ];
        }

        /**
         *
         */
        reset() {
            this.volume = 0;
            this.avgVolume = 0;
            this.peak = false;
            this.peakBPM = 0;
            this.peakReliable = false;
            this.firstPeak = 0;
            this.volumes = new Array(this.binCount).fill(0).map(Math.random);
            this.lastVolume = 0;
            this.peakData = [];
            this.peakThreshold = this.peakThresholdStart;
            this.lastPeak = 0;
            this.minPeakReliable = 2;
        }
    }

}
