/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {

    /**
     *
     * @constructor
     */
    HC.AudioAnalyser = function () {
        this.peakBPM = 0;
        this.peakReliable = false;
        this.peakCount = 0;
        this.peak = false;
        this.firstPeak = 0;
        this.volumes = false;

        const PEAK_THRESHOLD_START = 1.2;
        const PEAK_THRESHOLD_END = 3.6;

        var lastVolume = 0;
        var peakData = [];

        var peakThreshold = PEAK_THRESHOLD_START;
        var volumeSum = 0;
        var volumeCount = 0;

        var minPeakReliable = 2;
        var lastPeak = 0;

        var freqData;
        var domainData;
        var binCount; //1024

        this.analyser;

        /**
         *
         * @param v
         */
        // this.smoothingTimeConstant = function (v) {
        //     if (v !== undefined && this.analyser && v) {
        //         this.analyser.smoothingTimeConstant = v;
        //     }
        //
        //     return this.analyser ? this.analyser.smoothingTimeConstant : false;
        // };

        /**
         *
         */
        this.createAnalyser = function (context) {
            this.analyser = context.createAnalyser();
            this.analyser.smoothingTimeConstant = .6;
            this.analyser.fftSize = 1024;
            binCount = this.analyser.frequencyBinCount;
            this.volumes = new Array(binCount).fill(0);

            freqData = new Uint8Array(binCount);
            domainData = new Uint8Array(binCount);

            return this.analyser;
        };

        /**
         *
         * @param config
         */
        this.update = function (config) {

            var useWaveform = config.useWaveform;
            if (useWaveform) {
                this.analyser.getByteTimeDomainData(domainData);
            }

            this.analyser.getByteFrequencyData(freqData);

            lastVolume = this.volume;

            var values = 0;

            // get all the frequency amplitudes
            for (var i = 0; i < binCount; i++) {

                var val = freqData[i] / 256;
                var fbdv = useWaveform ? (domainData[i] / 256) : val;
                values += val;
                var last = this.volumes[i];
                var v = fbdv * config.volume;

                if (!useWaveform && config.thickness && last > v) {
                    var reduce = (.1 - (.1 * config.thickness)) * animation.diffPrc;
                    v = Math.max(v, last - reduce);
                    this.volumes[i] = v;

                } else {
                    this.volumes[i] = (v + last) / 2;  // make it softer
                }
            }

            this.volume = (values / binCount) * config.volume;

            this._beatRecognition(config);

            this.volume = (this.volume + lastVolume) / 2; // make it softer

            volumeSum += this.volume;
            volumeCount++;

            if (volumeCount >= 60) {
                this.avgVolume = volumeSum / volumeCount;
                volumeSum = this.avgVolume;
                volumeCount = 1;
            }


        };

        /**
         *
         * @param config
         * @private
         */
        this._beatRecognition = function (config) {
            var now = config.now;
            var diff = now - lastPeak;

            if (peakThreshold < PEAK_THRESHOLD_START) {
                peakThreshold = PEAK_THRESHOLD_START;

            } else if (peakThreshold > PEAK_THRESHOLD_END) {
                peakThreshold = PEAK_THRESHOLD_END;
            }

            var stepNow = this.volume / lastVolume;

            if (stepNow > peakThreshold && this.volume > 0.1 && diff > config.minDiff) {
                this.peak = true;
                this.peakCount++;

                if (this.peakCount > config.resetPeakCountAfter) {
                    this.peakCount = 0;
                }

                // add peakData
                var i = peakData.length;
                peakData[i] = {time: now, volume: this.volume};
                lastPeak = now;

                // calculate BPM
                if (i > minPeakReliable) {
                    this.firstPeak = peakData[i - minPeakReliable].time;
                    var timespan = lastPeak - this.firstPeak;
                    this.peakBPM = round(60000 / (timespan / minPeakReliable), 3);
                    this.peakReliable = 0;

                    var avgDiff = 60000 / this.peakBPM;

                    for (var pi = i - minPeakReliable; pi < i; pi++) {
                        var a = peakData[pi - 1];
                        var b = peakData[pi];
                        var d = b.time - a.time;
                        var prc = (avgDiff / d) * 100;

                        if (prc < 96 || prc > 104) {
                            if (this.peakReliable < minPeakReliable) {

                                // reduce minPR to try with smaller datasets
                                if (minPeakReliable > 4) {
                                    minPeakReliable--;
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
                        minPeakReliable = 16;
                    }

                    // reset after 128 or if peak is reliable
                    if (i >= 128 || this.peakReliable) {
                        peakData = [];
                    }

                    // adjust peakThreshold based on found peakBPM and designated speed
                    var prc = (config.speed / this.peakBPM) * 100;
                    if (prc > 200) {
                        peakThreshold -= 0.10;

                    } else if (prc > 102) {
                        peakThreshold -= 0.05;

                    } else if (prc < 50) {
                        peakThreshold += 0.10;

                    } else if (prc < 98) {
                        peakThreshold += 0.05;
                    }
                }

                // adjust peakThreshold based on found peakBPM and designated speed
                if (this.peakBPM < config.speed / 2) {
                    peakThreshold -= 0.10;

                } else if (this.peakBPM > config.speed * 2) {
                    peakThreshold += 0.05;
                }

            } else {
                this.peak = false;

                // did not find a peak for a long time adjust peakThreshold
                if (diff > config.minDiff * 16) {
                    lastPeak = now;

                    peakThreshold -= 0.10;
                }
            }
        };

        /**
         *
         */
        this.reset = function () {
            this.volume = 0;
            this.avgVolume = 0;
            this.peak = false;
            this.peakBPM = 0;
            this.peakReliable = false;
            this.firstPeak = 0;
            this.volumes = new Array(binCount).fill(Math.random);
            lastVolume = 0;
            peakData = [];
            peakThreshold = 1.2;
            lastPeak = 0;
            minPeakReliable = 2;
        };
    };

})();
