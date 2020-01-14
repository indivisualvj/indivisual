/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.ControlController = HC.ControlController || {};

{
    /**
     * 
     * @type {HC.ControlController.session}
     */
    HC.ControlController.session = class session extends HC.ControlSet {

        static index = 10;
        // static _name = 'session';

        settings = {
            session: 'root'
        };

        types = {
        };

        styles = {
        };
    }
}

{
    /**
     *
     * @type {HC.ControlController.controls}
     */
    HC.ControlController.controls = class controls extends HC.ControlSet {

        static index = 20;
        // static _name = 'controls';
        open = true;

        settings = {
            play: true,

            reset: function () {

                if (statics.ctrlKey) {
                    let yes = confirm('Reset everything?');
                    if (yes) {
                        let os = statics.ControlSettings.session;
                        // statics.ControlSettings.update(statics.ControlSettings.initial);
                        statics.ControlSettings.session = os;

                        messaging.emitControls(statics.ControlSettings, true, true, true);
                    }
                }

                if (statics.shiftKey || statics.ctrlKey) {
                    // sm.reset(splitToShuffleable(statics.ControlSettings.shuffleable));
                    cm.reset(splitToShuffleable(statics.ControlSettings.shuffleable));
                    controller.syncLayers();
                    controller.updateControl('reset', true, true, true, true);
                    explorer.resetPresets();
                    controller.updateControl('layer', statics.ControlSettings.layer, true, false, false);

                } else {
                    controller.updateControl('reset', true, true, true, false);
                }
            },

            monitor: false,
            push_layers: function () {
                controller.syncLayers();
            },
            push_sources: function () {
                controller.pushSources();
            },
            rst_shaders: function () {
                cm.update(statics.ControlSettings.layer, 'passes', 'shaders', []);
                let data = cm.get(statics.ControlSettings.layer, 'passes').prepare();
                controller.updateSettings(statics.ControlSettings.layer, data, false, false, true);
                messaging.emitSettings(statics.ControlSettings.layer, data, false, false, true);
            },
            debug: false,
            tempo: 120.00,
            beat: true,
            audio: 'off',
            peak_bpm_detect: true,
            layer: 0,

            shuffleable: '',
            shuffle_mode: 'off',
            shuffle_every: 16,

            volume: 1,
        };

        types = {
            tempo: [1, 200, 0.01],
            shuffle_every: [1, 64, 1],
            volume: ['hidden'],
            debug: ['hidden']
        };

        styles = {
            play: ['eight', 'clear'],
            reset: ['eight'],
            monitor: ['hex'],
            push_layers: ['hex'],
            push_sources: ['hex'],
            rst_shaders: ['quarter'],
            debug: ['eight'],

            tempo: ['half', 'clear'],
            beat: ['half'],

            audio: ['half', 'clear'],
            peak_bpm_detect: ['half'],

            layer: ['half', 'clear'],
            shuffleable: ['half'],

            shuffle_mode: ['half', 'clear'],
            shuffle_every: ['half']
        };

        events = {
            play: (inst) => { return new HC.KeyEvent('keyup', [32], (e) => {
                controller.updateControl('play', !statics.ControlSettings.play, true, true, false);
            }, 'spc')},
            reset: (inst) => { return new HC.KeyEvent('keyup', [46], (e) => {
                inst.settings.reset();
            }, 'del')},
            monitor: (inst) => { return new HC.KeyEvent('keyup', [36], (e) => {
                controller.updateControl('monitor', !statics.ControlSettings.monitor, true, true, false);
            }, 'hm')},
            push_layers: (inst) => { return new HC.KeyEvent('keyup', [35], (e) => {
                inst.settings.push_layers();
            }, 'end')},
            push_sources: (inst) => { return new HC.KeyEvent('keyup', [34], (e) => {
                inst.settings.push_sources();
            }, 'pgd')},
            rst_shaders: (inst) => { return new HC.KeyEvent('keyup', [33], (e) => {
                inst.settings.rst_shaders();
            }, 'pgu')},
        };
    }
}

{
    /**
     *
     * @type {HC.ControlControllerUi}
     */
    HC.ControlControllerUi = class ControlControllerUi extends HC.ControlSetGuifyUi {
        /**
         *
         * @param value
         */
        onChange(value) {
            controller.updateControl(this.property, value, true, true, false);
        }
    }
}
