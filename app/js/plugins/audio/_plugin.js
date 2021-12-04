HC.AudioManager = HC.AudioManager || {};
HC.AudioManager.plugins = HC.AudioManager.plugins || {};
{
    HC.AudioPlugin = class Plugin {

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
}
