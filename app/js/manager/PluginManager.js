/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import * as AudioPlugins from "../modules/audio.js"

class PluginManager
{

    static loadAudioPlugins() {
        console.log(AudioPlugins);
    }

    /**
     *
     * @param settings
     * @param section
     * @param plugins
     * @param className
     * @private
     */
    static _loadPlugins(settings, section, plugins, className) {

        let pluginKeys = Object.keys(plugins);

        pluginKeys.sort(this._sort(plugins, className||'Plugin'));

        for (let i = 0; i < pluginKeys.length; i++) {

            let pluginKey = pluginKeys[i];
            let plugin = plugins[pluginKey];
            let name = plugin.name || pluginKey;

            if (name === (className||'Plugin')) {
                name = pluginKey;
            }
            if (!(section in settings)) {
                settings[section] = {};
            }

            settings[section][pluginKey] = name;

        }
    }


    /**
     *
     * @param plugins
     * @param className
     * @returns {(function(*, *): (*))|*}
     * @private
     */
    static _sort (plugins, className) {
        return (a, b) => {
            let ai = plugins[a].index || 99999;
            let bi = plugins[b].index || 99999;
            let an = plugins[a].name || a;
            let bn = plugins[b].name || b;

            if (an === className) {
                an = a;
            }
            if (bn === className) {
                bn = b;
            }

            let cmpi = ai - bi;
            if (cmpi === 0) {
                return an.localeCompare(bn);
            }
            return cmpi;
        }
    }
}

export {PluginManager}

class Plugin
{

}

export {Plugin}