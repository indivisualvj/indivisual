/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ModulePlugin} from "./ModulePlugin";

class DisplaySourcePlugin extends ModulePlugin {

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
    _index;

    /**
     * @type {string}
     */
    type;

    /**
     * @type {OffscreenCanvas}
     */
    canvas;

    /**
     * @type {Animation}
     */
    animation;

    /**
     * @type {DisplayManager}
     */
    displayManager;

    /**
     * @type {SourceManager}
     */
    sourceManager;

    /**
     * @type {Renderer}
     */
    renderer;

    /**
     * @type {Config}
     */
    config;

    /**
     * @type {BeatKeeper}
     */
    beatKeeper;

    /**
     * @type {AudioAnalyser}
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
     * @param {Program} owner
     */
    constructor(owner) {
        super();
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
     * @param sourceManager
     * @param eventManager
     */
    static initListeners(sourceManager, eventManager) {

    }

    /**
     *
     */
    init(index) {
        this._index = index;
        this.id = this.type + index;
    }

    /**
     *
     * @returns {DisplaySourcePlugin}
     */
    getThis() {
        return this;
    }

    getIndex() {
        return this._index;
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

export {DisplaySourcePlugin}