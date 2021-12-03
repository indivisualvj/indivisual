/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class Program {

    /**
     * @type {string}
     */
    name;

    /**
     * @type {boolean}
     */
    ready = false;

    /**
     * @type {Config}
     */
    config;

    /**
     *
     * @type {SourceManager}
     */
    sourceManager;

    /**
     * @type {AudioManager}
     */
    audioManager;

    /**
     * @type {AudioAnalyser}
     */
    audioAnalyser;

    /**
     * @type {DisplayManager}
     */
    displayManager;

    /**
     * @type {BeatKeeper}
     */
    beatKeeper;

    /**
     * @type {LayeredControlSetManager}
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
export { Program }

