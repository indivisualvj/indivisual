class AudioPlugin {

    static index = -1;

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

export {AudioPlugin}