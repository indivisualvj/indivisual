/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class AudioManager
{
    static plugins;

    /**
     *
     * @param name
     * @param callback
     */
    initPlugin(name, callback) {
        this.plugin = new AudioManager.plugins.audio[name](this);
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

    /**
     *
     */
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
        this.stopContext();
    }

    stopContext() {
        if (this.context) {
            this.context.close();
            this.context = null;
        }
    }

    /**
     *
     */
    initContext() {
        if (!this.context) {
            this.context = new (window.AudioContext)();
        }

        return this.context;
    }
}

export {AudioManager}