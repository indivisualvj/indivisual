var HC = HC || {};
{
    /**
     *
     * @type {{new(*): HC.Program, name: *, prototype: Program}}
     */
    HC.Program = class Program {

        /**
         * @type {string}
         */
        name;

        /**
         * @type {boolean}
         */
        ready = false;


        /**
         * @type {HC.Messaging}
         */
        messaging;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         *
         * @type {HC.SourceManager}
         */
        sourceManager;

        /**
         * @type {HC.AudioManager}
         */
        audioManager;

        /**
         * @type {HC.AudioAnalyser}
         */
        audioAnalyser;

        /**
         * @type {HC.DisplayManager}
         */
        displayManager;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         * @type {HC.Listener}
         */
        listener;

        /**
         * @type {HC.LayeredControlSetsManager}
         */
        settingsManager;

        /**
         *
         * @param name
         */
        constructor(name) {
            this.name = name;
        }
    }
}
