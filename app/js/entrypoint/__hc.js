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

        /**
         * 
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateControl(item, value, display, forward, force) {
            console.warn('not implemented');
        }

        /**
         * 
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateControls(data, display, forward, force) {
            console.warn('not implemented');
        }

        /**
         *
         * @param data
         */
        updateData(data) {
        }

        /**
         *
         * @param data
         */
        updateMidi(data) {
        }

        /**
         * 
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateDisplay(item, value, display, forward, force) {
            console.warn('not implemented');
        }

        /**
         * 
         * @param layer
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSetting(layer, data, display, forward, force) {
            console.warn('not implemented');
        }
        
        /**
         * 
         * @param layer
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSettings(layer, data, display, forward, force) {
            console.warn('not implemented');
        }

        /**
         * 
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateControls(data, display, forward, force) {
            console.warn('not implemented');
        }

        /**
         * 
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateDisplays(data, display, forward, force) {
            console.warn('not implemented');
        }

        /**
         * 
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSources(data, display, forward, force) {
            console.warn('not implemented');
        }

        /**
         * 
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateSource(item, value, display, forward, force) {
            console.warn('not implemented');
        }
    }
}
