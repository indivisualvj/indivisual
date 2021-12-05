/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ModulePlugin} from "../../shared/ModulePlugin";

class AudioPlugin extends ModulePlugin
{
    /**
     * @type {AudioManager}
     */
    manager;

    source;

    stream;

    /**
     *
     * @param {AudioManager} manager
     */
    constructor(manager) {
        super();
        this.manager = manager;
    }

    static boot() {

    }

    start() {

    }

    stop() {
        this.disconnect();
    }

    isActive() {
        return this.source;
    }

    disconnect() {
        if (this.source) {
            this.source.disconnect();
        }

        this.source = false;
    }

    getContext() {
        return this.manager.initContext();
    }
}
