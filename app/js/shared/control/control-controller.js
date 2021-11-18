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

            reset: () => {

                if (this.config.messaging.program.config.shiftKey && this.config.messaging.program.config.ctrlKey) {
                    let yes = confirm('Reset everything?');
                    if (yes) {
                        this.config.messaging.program.fullReset();
                    }
                } else if (this.config.messaging.program.config.shiftKey) {
                    this.config.messaging.program.resetLayers();

                } else {
                    this.config.messaging.program.updateControl('reset', true, true, true, false);
                }
            },

            monitor: false,
            push_layers: () => {
                this.config.messaging.program.pushLayers();
            },
            push_sources: () => {
                this.config.messaging.program.pushSources();
            },
            rst_shaders: () => {
                this.config.messaging.program.settingsManager.update(this.config.ControlSettings.layer, 'passes', 'shaders', []);
                let data = this.config.messaging.program.settingsManager.get(this.config.ControlSettings.layer, 'passes').prepare();
                this.config.messaging.program.updateSettings(this.config.ControlSettings.layer, data, false, false, true);
                this.config.messaging.emitSettings(this.config.ControlSettings.layer, data, false, false, true);
            },
            layout_close: () => {
                this.config.messaging.program.closeAll();
            },
            layout_control: () => {
                this.config.messaging.program.closeAll();
                this.config.messaging.program.openTreeByPath('controls');
            },
            layout_display: () => {
                this.config.messaging.program.closeAll();
                this.config.messaging.program.openTreeByPath('displays/_general');
            },
            layout_source: () => {
                this.config.messaging.program.closeAll();
                this.config.messaging.program.openTreeByPath('source');
            },
            layout_override: () => {
                this.config.messaging.program.closeAll();
                this.config.messaging.program.openTreeByPath('override');
            },
            layout_animation: () => {
                this.config.messaging.program.closeAll();
                let control = this.config.messaging.program.guis[3];
                control.setOpen(true);
            },
            layout_sequence: () => {
                this.config.messaging.program.closeAll();
                let control = this.config.messaging.program.guis[4];
                this.config.messaging.program.openAll(control);
            },
            layout_presets: () => {
                this.config.messaging.program.closeAll();
                this.config.messaging.program.toggleByKey(5);
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
            debug: ['hidden'],
            layout_control: ['hidden'],
            layout_presets: ['hidden'],
            layout_sequence: ['hidden'],
            layout_display: ['hidden'],
            layout_source: ['hidden'],
            layout_animation: ['hidden'],
            layout_animation_fullscreen: ['hidden'],
            layout_sequence_fullscreen: ['hidden'],
            layout_source_fullscreen: ['hidden'],
            layout_close: ['hidden'],
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
            shuffle_every: ['half'],
        };

        attributes = {
            reset: {
                title: 'Press SHIFT to delete all (NOT shuffleable) layers.\nPress CTRL+SHIFT to reset EVERYTHING!'
            },
            shuffleable: {
                title: 'Only layer 1..20, will be included if shuffle is active.\nOn layer reset (SHIFT+DEL) only these layers be reset.\n',
            },
        };

        events = {
            play: (inst) => { return new HC.KeyEvent('keyup', [32], (e) => {
                this.config.messaging.program.updateControl('play', !this.config.ControlSettings.play, true, true, false);
            }, 'spc')},
            reset: (inst) => { return new HC.KeyEvent('keyup', [46], (e) => {
                inst.settings.reset();
            }, 'del')},
            monitor: (inst) => { return new HC.KeyEvent('keyup', [36], (e) => {
                this.config.messaging.program.updateControl('monitor', !this.config.ControlSettings.monitor, true, true, false);
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
