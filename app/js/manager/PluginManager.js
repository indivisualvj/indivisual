/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import * as ControlControlSets from "../modules/control_set/Control";
import * as SourceControlSets from "../modules/control_set/Source";
import * as DisplayControlSets from "../modules/control_set/Display";
import {AudioManager} from "./AudioManager";
import {Renderer} from "../animation/Renderer";
import {DisplayManager} from "./DisplayManager";
import {SourceManager} from "./SourceManager";
import {LayeredControlSetManager} from "./LayeredControlSetManager";
import {Logger} from "../shared/Logger";
import {Messaging} from "../shared/Messaging";

class PluginManager
{
    /**
     *
     * @param settings
     * @param section
     * @param target
     * @param config
     * @return {Promise<unknown>}
     */
    static assignLayerPlugins(settings, section, target, config) {
        return new Promise((resolve) => {
            this._importPlugins(HC.filePath('layer', section)).then((plugins) => {
                this._assignPlugins(settings, section, plugins, target, config);
                resolve();
            });
        });
    }


    /**
     *
     * @param settings
     * @param config
     * @param callback
     */
    static assignAudioPlugins(settings, config, callback) {

        this._importPlugins('audio').then((plugins) => {
            AudioManager.plugins = AudioManager.plugins || {};
            this._assignPlugins(settings, 'audio', plugins, AudioManager.plugins, config);
            callback();
        });
    }

    /**
     *
     * @param settings
     * @param config
     * @param callback
     */
    static assignShuffleModePlugins(settings, config, callback) {

        this._importPlugins('shuffle_mode').then((plugins) => {
            Renderer.plugins = Renderer.plugins || {};
            this._assignPlugins(settings, 'shuffle_mode', plugins, Renderer.plugins, config);
            callback();
        });
    }

    /**
     *
     * @param settings
     * @param config
     * @param callback
     */
    static assignDisplayVisibilityPlugins(settings, config, callback) {
        this._importPlugins('display_visibility').then((plugins) => {
            DisplayManager.plugins = DisplayManager.plugins || {};
            this._assignPlugins(settings, 'display_visibility', plugins, DisplayManager.plugins, config);
            callback();
        });
    }

    /**
     *
     * @param settings
     * @param config
     * @param callback
     */
    static assignBorderModePlugins(settings, config, callback) {
        this._importPlugins('border_mode').then((plugins) => {
            DisplayManager.plugins = DisplayManager.plugins || {};
            this._assignPlugins(settings, 'border_mode', plugins, DisplayManager.plugins, config);
            callback();
        });
    }

    /**
     *
     * @param settings
     * @param config
     * @param callback
     */
    static assignDisplaySourcePlugins(settings, config, callback) {
        this._importPlugins('display_source').then((plugins) => {
            SourceManager.plugins = SourceManager.plugins || {};
            this._assignPlugins(settings, 'display_source', plugins, SourceManager.plugins, config);
            callback();
        });
    }

    /**
     *
     * @param target
     * @param callback
     */
    static assignControlSets(target, callback) {
        LayeredControlSetManager.plugins = { control_set: {} };

        this._importPlugins(HC.filePath('control_set', 'animation')).then((plugins) => {
            let keys = Object.keys(plugins);

            keys.sort(this._sort(plugins));

            for (let k in keys) {

                let key = keys[k].toSnakeCase();
                let plugin = plugins[keys[k]];

                target[key] = plugin._name || key;

                LayeredControlSetManager.plugins.control_set[key] = plugin;
            }

            callback();
        });
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
                Logger.log(s + '.' + p, 'booted');
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
            Logger.log(k, 'instantiated');
            if (hook) {
                hook(plugin);
            }
        }
    }

    /**
     *
     * @param dir
     * @return {Promise<unknown>}
     * @private
     */
    static _importPlugins(dir) {

        return new Promise((resolve) => {
            let searchPath = HC.filePath(APP_DIR, 'js', 'modules', dir);
            let importPath = HC.filePath('..', 'modules', dir);
            let plugins = {};
            let imports = [];

            Messaging.samples(searchPath, (files) => {
                files.forEach((file) => {
                    imports.push(import(HC.filePath(importPath, file.name)));
                });

                Promise.all(imports).then(function () {
                    for (const plugin of arguments[0]) {
                        for (const pluginKey in plugin) {
                            plugins[pluginKey] = plugin[pluginKey];
                            Logger.log(dir + '/' + pluginKey, 'imported');
                        }
                    }
                    resolve(plugins);
                });
            });
        });
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

        if (!(section in settings)) {
            settings[section] = {};
        }
        if (!(section in target)) {
            target[section] = {};
        }

        let pluginKeys = Object.keys(plugins);

        pluginKeys.sort(this._sort(plugins));

        for (let i = 0; i < pluginKeys.length; i++) {

            let pluginKey = pluginKeys[i];
            let plugin = plugins[pluginKey];
            let name = plugin.name || pluginKey.toKebapCase();
            pluginKey = pluginKey.toSnakeCase();

            target[section][pluginKey] = plugin;
            settings[section][pluginKey] = name.toLowerCase();
            Logger.log(section + '.' + pluginKey, 'assigned');
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