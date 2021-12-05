/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import * as AudioPlugins from "../modules/audio.js"
import * as ShuffleModePlugins from "../modules/shuffle_mode.js";
import * as DisplayVisibilityPlugins from "../modules/display_visibility.js";
import * as BorderModePlugins from "../modules/border_mode.js";
import * as DisplaySourcePlugins from "../modules/display_source.js";
import * as AnimationControlSets from "../modules/control_set/animation.js";
import * as ControlControlSets from "../modules/control_set/Control";
import * as SourceControlSets from "../modules/control_set/Source";
import * as DisplayControlSets from "../modules/control_set/Display";
import {AudioManager} from "./AudioManager";
import {Renderer} from "../animation/Renderer";
import {DisplayManager} from "./DisplayManager";
import {SourceManager} from "./SourceManager";
import {LayeredControlSetManager} from "./LayeredControlSetManager";
import {Logger} from "../shared/Logger";

class PluginManager
{
    /**
     *
     * @param plugins
     * @param initiator
     * @param config
     */
    static bootPlugins(plugins, initiator, config) {
        for (let s in plugins) {
            let subset = plugins[s];
            for (let p in subset) {
                subset[p].boot(initiator, config);
                // Logger.log(s + '.' + p, 'booted');
            }
        }
    }

    /**
     *
     * @param initiator
     * @param plugins
     * @param settings
     * @param hook
     */
    static instantiatePlugins(initiator, plugins, settings, hook) {
        for (let k in plugins) {
            let plugin = plugins[k];
            plugin = new plugin(initiator, settings);
            plugins[k] = plugin;
            if (hook) {
                hook(plugin);
            }
            // Logger.log(k, 'instantiated');
        }
    }

    /**
     *
     * @param settings
     * @param config
     */
    static assignAudioPlugins(settings, config) {
        AudioManager.plugins = AudioManager.plugins || {};
        this._assignPlugins(settings, 'audio', AudioPlugins, AudioManager.plugins, config);
    }

    /**
     *
     * @param settings
     * @param config
     */
    static assignShuffleModePlugins(settings, config) {
        Renderer.plugins = Renderer.plugins || {};
        this._assignPlugins(settings, 'shuffle_mode', ShuffleModePlugins, Renderer.plugins, config);
    }

    /**
     *
     * @param settings
     * @param config
     */
    static assignDisplayVisibilityPlugins(settings, config) {
        DisplayManager.plugins = DisplayManager.plugins || {};
        this._assignPlugins(settings, 'display_visibility', DisplayVisibilityPlugins, DisplayManager.plugins, config);
    }

    /**
     *
     * @param settings
     * @param config
     */
    static assignBorderModePlugins(settings, config) {
        DisplayManager.plugins = DisplayManager.plugins || {};
        this._assignPlugins(settings, 'border_mode', BorderModePlugins, DisplayManager.plugins, config);
    }

    /**
     *
     * @param settings
     * @param config
     */
    static assignDisplaySourcePlugins(settings, config) {
        SourceManager.plugins = SourceManager.plugins || {};
        this._assignPlugins(settings, 'display_source', DisplaySourcePlugins, SourceManager.plugins, config);
    }

    /**
     *
     * @param target
     */
    static assignControlSets(target) {
        LayeredControlSetManager.plugins = { control_set: {} };

        let plugins = AnimationControlSets;
        let keys = Object.keys(plugins);

        keys.sort(this._sort(plugins));

        for (let k in keys) {

            let key = keys[k].toSnakeCase();
            let plugin = plugins[keys[k]];

            target[key] = plugin._name || key;

            LayeredControlSetManager.plugins.control_set[key] = plugin;
        }
    }

    /**
     *
     * @return {{session?: session, controls?: controls}}
     */
    static getControlSets() {
        return ControlControlSets;
    }

    /**
     *
     * @return {{override?: override, sequenceN?: sequenceN, sample?: sample, source?: source}}
     */
    static getSourceSets() {
        return SourceControlSets;
    }

    /**
     *
     * @return {{displays?: {}, video?: {}}}
     */
    static getDisplaySets() {
        return DisplayControlSets;
    }

    // todo: port all getPlugin/doPlugin to here?

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

        Logger.log('assign', section);

        let pluginKeys = Object.keys(plugins);

        pluginKeys.sort(this._sort(plugins));

        for (let i = 0; i < pluginKeys.length; i++) {

            let pluginKey = pluginKeys[i];
            let plugin = plugins[pluginKey];
            pluginKey = pluginKey.toSnakeCase();

            let name = plugin.name || pluginKey;

            if (!(section in settings)) {
                settings[section] = {};
            }
            if (!(section in target)) {
                target[section] = {};
            }

            target[section][pluginKey] = plugin;
            settings[section][pluginKey] = name.toLowerCase();
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
