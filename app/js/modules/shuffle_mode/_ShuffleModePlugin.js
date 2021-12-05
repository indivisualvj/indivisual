/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ModulePlugin} from "../../shared/ModulePlugin";

class ShuffleModePlugin extends ModulePlugin
{
    settings;
    layer = 0;

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
     *
     * @param {Renderer} renderer
     * @param settings
     */
    constructor(renderer, settings) {
        super();
        this.renderer = renderer;
        this.config = renderer.config;
        this.beatKeeper = renderer.beatKeeper;
        this.settings = settings;
    }

    static boot() {

    }

    after() {
        if (!this.validate(this.getLayer())) {
            console.log('schuffle_mode.layer', 'fail');
            return false;
        }

        console.log('schuffle_mode.layer', this.getLayer());
        return this.getLayer();
    }

    next() {
        console.error('.next() must be implemented in derived plugin')
    }

    getLayer() {
        let pile = this.getPile();
        return pile.length ? pile[this.layer] : 0;
    }

    getPile() {
        let pile = [];
        for (let i = 0; i < this.config.ControlValues.layers; i++) {
            if (this.validate(i)) {
                pile.push(i);
            }
        }
        return pile;
    }

    validate(i) {
        if (this.config.shuffleable(i + 1) && !this.renderer.animation.settingsManager.isDefault(i)) {
            // alright!
            return true;
        }

        return false;
    }
}
