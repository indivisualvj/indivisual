/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class AnimationPlugin
{
    /**
     * @type {Animation}
     */
    animation;

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
     * @type {SourceManager}
     */
    sourceManager;

    /**
     * @type {DisplayManager}
     */
    displayManager;

    /**
     * @type {Layer}
     */
    layer;

    settings;

    controlSets;

    tree;

    key;

    id(suffix) {
        return this.layer.index + '.' + this.tree + '.' + this.key + (suffix!==undefined?'.' + suffix:'');
    }

    /**
     *
     * @param {Shape} shape
     * @returns {*}
     */
    shapeVolume(shape) {
        return this.audioAnalyser.getVolume(shape.index);
    }

    /**
     *
     * @param {Animation} animation
     * @param {Layer} layer
     * @param settings
     * @param tree
     * @param key
     * @returns {AnimationPlugin}
     */
    construct(animation, layer, settings, tree, key) {
        this.animation = animation;
        this.config = animation.config;
        this.beatKeeper = animation.beatKeeper;
        this.audioAnalyser = animation.audioAnalyser;
        this.displayManager = animation.displayManager;
        this.sourceManager = animation.sourceManager;
        this.layer = layer;
        this.settings = settings;
        this.tree = tree;
        this.key = key;

        this.init();

        return this;
    }

    /**
     * use this for custom code on construction
     */
    init() {

    }

    setControlSets(controlSets) {
        this.controlSets = controlSets;
    }

    inject(shapeClass) {
        shapeClass.injected.plugins[this.tree][this.key] = {
            values: this.injections || {}
        };
    }

    params(shape, values) {

        if (values !== undefined) {
            shape.plugins[this.tree][this.key].values = values;
        }

        return shape.plugins[this.tree][this.key].values;
    }

    tween(from) {
        return new TWEEN.Tween(from, this.layer.tween);
    }

    tweenShape(shape, from, to) {

        let speed = this.layer.shapeSpeed(shape);
        let delay = this.layer.shapeDelay(shape);

        let duration = speed.duration;
        let dly = delay.delay;

        // tweens may never be longer than their superordinate delay + duration
        let time = speed.speed.duration - speed.duration - delay.delay - speed.speed.progress;
        if (time < 0) {
            time = Math.abs(time) + 5;
            if (delay.delay > time) {
                dly -= time;

            } else if (speed.duration > time) {
                duration -= time;
            }
        }

        return this.tween(from)
            .to(to, duration)
            .delay(dly);
    }

    /**
     * Start tweens synchronized
     * @param tween
     */
    tweenStart(tween) {
        tween.start(this.animation.now - this.layer.lastUpdate);
    }

    /**
     * Prepare etc.
     * Using isFirstShape plugins can be cancelled here if processing all shapes is not necessary.
     * @returns {boolean} true means continue, false means stop (do not call apply+after)
     */
    //before () {}

    /**
     *
     * @returns {boolean} true means continue, false means stop (do not call after)
     */
    // apply () {}

    /**
     * Clean up etc.
     */

    // after () {}

    /**
     * For plugins to determine if it is first or layer's dummy shape.
     * @see before
     * @param shape
     * @returns {boolean}
     */
    isFirstShape(shape) {
        return shape.index === 0;
    }

    /**
     *
     * @returns {boolean}
     */
    ready() {
        return true;
    }
}

export {AnimationPlugin};
