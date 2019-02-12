/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {

    /**
     *
     * @constructor
     */
    HC.AudioManager = function () {

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        var inst = this;
        var source = false;

        /**
         *
         */
        this.initMicrophone = function(callback) {

            if (navigator.mediaDevices.getUserMedia) {

                try {
                    navigator.mediaDevices.getUserMedia({audio: true, video: false})
                        .then(
                            function (stream) {

                                source = inst.context.createMediaStreamSource(stream);

                                if (callback) {
                                    callback(source);
                                }
                            }
                            , function (ex) {
                                _log('audio', ex.message, true);
                            });
                } catch (ex) {
                    _log('audio', ex.message, true);
                }

            } else {
                _log('audio', 'could not getUserMedia', true);
            }
        };

        /**
         *
         * @param file
         */
        this.initMediaStream = function (file) {

        };

        /**
         *
         * @param url
         */
        this.initSoundCloudStream = function (url) {

        };

        /**
         *
         * @returns {boolean}
         */
        this.isActive = function () {
            return source != false;
        };

        /**
         *
         */
        this.reset = function () {
            if (source) {
                source.disconnect();
            }

            source = false;

            this.initContext();
        };

        /**
         *
         */
        this.initContext = function () {
            if (this.context) {
                this.context.close();
            }
            this.context = new (window.AudioContext)();
        }

    }
})();