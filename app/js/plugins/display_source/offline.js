/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.SourceManager.display_source.offline = class Plugin extends HC.SourceManager.DisplaySourcePlugin {

        static index = 50;

        getThis() {
            return false;
        }
    }
}
