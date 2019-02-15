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

        /**
         *
         * @param name
         * @param callback
         */
        this.initPlugin = function (name, callback) {
            this.plugin = new HC.audio[name]().construct(this.context);
            this.plugin.init(callback);
        };

        /**
         *
         * @returns {boolean}
         */
        this.isActive = function () {
            if (this.plugin) {
                return this.plugin.isActive();
            }

            return false;
        };

        this.start = function () {
            if (this.plugin) {
                this.plugin.start();
            }
        };

        /**
         *
         */
        this.stop = function () {
            if (this.plugin) {
                this.plugin.stop();
            }

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