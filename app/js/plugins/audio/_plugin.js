HC.audio = HC.audio || {};
{
    HC.AudioPlugin = class Plugin {

        construct(context) {
            this.context = context;
            this.source;
            this.stream;
            return this;
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
    }
}