/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import * as AudioPlugins from "../modules/audio.js"
import * as ShuffleModePlugins from "../modules/shuffle_mode.js";
import {AudioManager} from "./AudioManager";
import {Renderer} from "../animation/Renderer";

class PluginManager
{

    static assignAudioPlugins(settings, config) {
        AudioManager.plugins = {};
        this._assignPlugins(settings, 'audio', AudioPlugins, AudioManager.plugins, config);
    }

    static assignShuffleModePlugins(settings, config) {
        Renderer.plugins = {};
        this._assignPlugins(settings, 'shuffle_mode', ShuffleModePlugins, Renderer.plugins, config);
    }

    /**
     *
     * @param settings
     * @param section
     * @param plugins
     * @param target
     * @param config{Config}
     * @private
     */
    static _assignPlugins(settings, section, plugins, target, config) {

        let pluginKeys = Object.keys(plugins);

        pluginKeys.sort(this._sort(plugins));

        for (let i = 0; i < pluginKeys.length; i++) {

            let pluginKey = pluginKeys[i];
            let plugin = plugins[pluginKey];
            pluginKey = pluginKey.toLowerCase();

            if (plugin.index === -1) {
                continue;
            }

            let name = plugin.name || pluginKey;

            if (!(section in settings)) {
                settings[section] = {};
            }
            if (!(section in target)) {
                target[section] = {};
            }

            target[section][pluginKey] = plugin;
            settings[section][pluginKey] = name.toLowerCase();
            plugin.boot(this, config);

        }
    }


    /**
     *
     * @param plugins
     * @return {(function(*, *): (*))|*}
     * @private
     */
    static _sort (plugins) {
        return (a, b) => {
            let ai = plugins[a].index || 99999;
            let bi = plugins[b].index || 99999;
            let an = plugins[a].name || a;
            let bn = plugins[b].name || b;

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