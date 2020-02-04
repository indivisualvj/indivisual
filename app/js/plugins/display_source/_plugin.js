/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
/**
 *
 * @type {Object<string, HC.SourceManager.DisplaySourcePlugin>}
 */
HC.SourceManager.display_source = {};
{
    /**
     *
     * @type {HC.SourceManager.DisplaySourcePlugin}
     */
    HC.SourceManager.DisplaySourcePlugin = class DisplaySourcePlugin {

        static _index = 99;

        cacheable = true;

        id;

        type;

        /**
         * @type {HTMLElement}
         */
        canvas;

        /**
         * @type {HC.Program}
         */
        animation;

        /**
         * @type {HC.Listener}
         */
        listener;

        /**
         * @type {HC.DisplayManager}
         */
        displayManager;

        /**
         * @type {HC.SourceManager}
         */
        sourceManager;

        /**
         * @type {HC.Renderer}
         */
        renderer;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         * @type {HC.AudioAnalyser}
         */
        audioAnalyser;

        /**
         *
         * @type {number}
         */
        width = 1280;

        /**
         *
         * @type {number}
         */
        height = 720;

        /**
         * @type {HC.Display}
         */
        display;

        /**
         * @param {HC.Display}
         * @param {HC.Program} owner
         */
        constructor(display, owner) {
            this.display = display;
            this.animation = owner;
            this.displayManager = owner.displayManager;
            this.beatKeeper = owner.beatKeeper;
            this.audioAnalyser = owner.audioAnalyser;
            this.listener = owner.listener;
            this.sourceManager = owner.sourceManager;
            if (this.sourceManager) {
                this.renderer = this.sourceManager.renderer;
            }
            this.config = owner.config;
        }

        /**
         *
         */
        init() {

        }

        /**
         *
         * @returns {HC.SourceManager.DisplaySourcePlugin}
         */
        getThis() {
            return this;
        }

        /**
         *
         * @param {number} width
         * @param {number} height
         */
        update(width, height) {
            this.width = width;
            this.height = height;
        }

        /**
         *
         * @returns {number}
         */
        brightness() {
            return this.displayManager.brightness();
        }

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds(reference) {
            return reference;
        }

        /**
         *
         * @param fallback
         * @param passthrough
         * @returns {*}
         */
        current(fallback, passthrough) {
            return fallback;
        }

        /**
         *
         */
        reset() {

        }

        /**
         *
         * @returns {boolean}
         */
        isReady() {
            return true;
        }

        /**
         *
         */
        last() {

        }

        next() {

        }
    }
}
