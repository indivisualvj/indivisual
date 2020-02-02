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

                if (messaging.program.config.ctrlKey) {
                    let yes = confirm('Reset everything?');
                    if (yes) {
                        let os = this.config.ControlSettings.session;
                        // this.config.ControlSettings.update(this.config.ControlSettings.initial);
                        this.config.ControlSettings.session = os;

                        messaging.emitControls(this.config.ControlSettings, true, true, true);
                    }
                }

                if (messaging.program.config.shiftKey || messaging.program.config.ctrlKey) {
                    // sm.reset(splitToIntArray(this.config.ControlSettings.shuffleable));
                    messaging.program.settingsManager.reset(splitToIntArray(this.config.ControlSettings.shuffleable));
                    messaging.program.syncLayers();
                    messaging.program.updateControl('reset', true, true, true, true);
                    messaging.program.explorer.resetPresets();
                    messaging.program.updateControl('layer', this.config.ControlSettings.layer, true, false, false);

                } else {
                    messaging.program.updateControl('reset', true, true, true, false);
                }
            },

            monitor: false,
            push_layers: function () {
                messaging.program.syncLayers();
            },
            push_sources: function () {
                messaging.program.pushSources();
            },
            rst_shaders: function () {
                messaging.program.settingsManager.update(this.config.ControlSettings.layer, 'passes', 'shaders', []);
                let data = messaging.program.settingsManager.get(this.config.ControlSettings.layer, 'passes').prepare();
                messaging.program.updateSettings(this.config.ControlSettings.layer, data, false, false, true);
                messaging.emitSettings(this.config.ControlSettings.layer, data, false, false, true);
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
                messaging.program.updateControl('play', !this.config.ControlSettings.play, true, true, false);
            }, 'spc')},
            reset: (inst) => { return new HC.KeyEvent('keyup', [46], (e) => {
                inst.settings.reset();
            }, 'del')},
            monitor: (inst) => { return new HC.KeyEvent('keyup', [36], (e) => {
                messaging.program.updateControl('monitor', !this.config.ControlSettings.monitor, true, true, false);
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
         * @param that
         */
        onChange(value, that) {
            messaging.program.updateControl(that.getProperty(), value, true, true, false);
        }
    }
}
