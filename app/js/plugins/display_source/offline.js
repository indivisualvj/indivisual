/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.SourceManager.display_source.Offline}
     */
    HC.SourceManager.display_source.offline = class Offline extends HC.SourceManager.DisplaySourcePlugin {

        update(width, height) {
            this.display.offline = true;
            this.display.canvas.style.display = 'none';
        }

        getThis() {
            return false;
        }
    }
}
