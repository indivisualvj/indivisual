/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.AudioManager}
     */
    HC.AudioManager = class AudioManager {

        /**
         *
         */
        constructor() {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
        }

        /**
         *
         * @param name
         * @param callback
         */
        initPlugin(name, callback) {

            // this is 1 ugly workaround
            if (IS_MONITOR && name !== 'off') {
                name = 'microphone';
            }

            this.plugin = new HC.audio[name]().construct(this.context);
            this.plugin.init(callback);
        }

        /**
         *
         * @returns {boolean}
         */
        isActive() {
            if (this.plugin) {
                return this.plugin.isActive();
            }

            return false;
        }

        start() {
            if (this.plugin) {
                this.plugin.start();
            }
        }

        /**
         *
         */
        stop() {
            if (this.plugin) {
                this.plugin.stop();
            }

            this.initContext();
        }

        /**
         *
         */
        initContext() {
            if (this.context) {
                this.context.close();
            }
            this.context = new (window.AudioContext)();
        }
    }
}