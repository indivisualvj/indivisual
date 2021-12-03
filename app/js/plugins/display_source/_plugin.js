/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
HC.SourceManager = HC.SourceManager || {};
HC.SourceManager.display_source = {};
{

    HC.SourceManager.DisplaySourcePlugin = class DisplaySourcePlugin {

        static _index = 99;

        /**
         *
         * @type {boolean}
         */
        cacheable = true;

        /**
         * @type {string}
         */
        id;

        /**
         * @type {number}
         */
        index;

        /**
         * @type {string}
         */
        type;

        /**
         * @type {OffscreenCanvas}
         */
        canvas;

        /**
         * @type {HC.Program}
         */
        animation;

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
         * @type {Config}
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
         *
         * @param {HC.Program} owner
         */
        constructor(owner) {
            this.animation = owner;
            this.displayManager = owner.displayManager;
            this.beatKeeper = owner.beatKeeper;
            this.audioAnalyser = owner.audioAnalyser;
            this.sourceManager = owner.sourceManager;
            if (this.sourceManager) {
                this.renderer = this.sourceManager.renderer;
            }
            this.config = owner.config;
        }

        /**
         *
         * @param {HC.SourceManager} sourceManager
         */
        static initListeners(sourceManager) {

        }

        /**
         *
         */
        init(index) {
            this.index = index;
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

        updateSource() {

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

        /**
         *
         */
        next() {

        }
    }
}
