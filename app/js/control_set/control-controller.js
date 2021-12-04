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
        open = true;

        settings = {
            play: true,

            reset: () => {
                if (HC.Hotkey.isPressed('shift') && HC.Hotkey.isPressed('ctrl')) {
                    let yes = confirm('Reset everything?');
                    if (yes) {
                        this.messaging.program.fullReset();
                    }
                } else if (HC.Hotkey.isPressed('shift')) {
                    let _done = false;
                    this.messaging.program.midi.loading(() => {
                        return _done;
                    });
                    this.messaging.program.resetLayers().finally(() => {
                        _done = true;
                    });

                } else {
                    this.messaging.program.updateControl('reset', true, true, true, false);
                }
            },

            preview: false,
            push_layers: () => {
                this.messaging.program.pushLayers();
            },
            push_sources: () => {
                this.messaging.program.pushSources();
            },
            rst_shaders: () => {
                this.messaging.program.resetShaders(HC.Hotkey.isPressed('shift')).finally(()=>{});
            },
            enable_mic: () => {
                this.messaging.program.updateControl('audio', 'microphone', true, true, false);
            },
            reset_overrides: () => {
                this.messaging.program.updateSource('override_material_input', 'none', true, true, false);
                this.messaging.program.updateSource('override_background_mode', 'none', true, true, false);
            },
            layout_close: () => {
                this.messaging.program.closeAll();
            },
            layout_control: () => {
                this.messaging.program.closeAll();
                this.messaging.program.openTreeByPath('controls');
            },
            layout_display: () => {
                this.messaging.program.closeAll();
                this.messaging.program.openTreeByPath('displays/_general');
            },
            layout_source: () => {
                this.messaging.program.closeAll();
                this.messaging.program.openTreeByPath('source');
            },
            layout_override: () => {
                this.messaging.program.closeAll();
                this.messaging.program.openTreeByPath('override');
            },
            layout_animation: () => {
                this.messaging.program.closeAll();
                let control = this.messaging.program.guis[3];
                control.setOpen(true);
            },
            layout_sequence: () => {
                this.messaging.program.closeAll();
                let control = this.messaging.program.guis[4];
                this.messaging.program.openAll(control);
            },
            layout_presets: () => {
                this.messaging.program.closeAll();
                this.messaging.program.toggleByKey(5);
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
        };

        styles = {
            play: ['eight', 'clear'],
            reset: ['eight'],
            preview: ['hex'],
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
            enable_mic: (inst) => {
                return new HC.Hotkey('ctrl+shift+f9', (e) => {
                    this.settings.enable_mic();
                });
            },
            reset_overrides: (inst) => {
                return new HC.Hotkey('ctrl+shift+f10', (e) => {
                    this.settings.reset_overrides();
                });
            },
            layout_control: (inst) => {
                return new HC.Hotkey('ctrl+1', (e) => {
                    this.settings.layout_control();
                });
            },
            layout_display: (inst) => {
                return new HC.Hotkey('ctrl+2', (e) => {
                    this.settings.layout_display();
                });
            },
            layout_source: (inst) => {
                return new HC.Hotkey('ctrl+3', (e) => {
                    this.settings.layout_source();
                });
            },
            layout_override: (inst) => {
                return new HC.Hotkey('ctrl+4', (e) => {
                    this.settings.layout_override();
                });
            },
            layout_animation: (inst) => {
                return new HC.Hotkey('ctrl+5', (e) => {
                    this.settings.layout_animation();
                });
            },
            layout_sequence: (inst) => {
                return new HC.Hotkey('ctrl+6', (e) => {
                    this.settings.layout_sequence();
                });
            },
            layout_presets: (inst) => {
                return new HC.Hotkey('ctrl+7', (e) => {
                    this.settings.layout_presets();
                });
            },
            layout_close: (inst) => {
                return new HC.Hotkey('ctrl+0', (e) => {
                    this.settings.layout_close();
                });
            },
            play: (inst) => { return new HC.Hotkey('space', (e) => {
                this.messaging.program.updateControl('play', !this.config.ControlSettings.play, true, true, false);
            }, 'spc')},
            reset: (inst) => { return new HC.Hotkey('delete,shift+delete,ctrl+shift+delete', (e) => {
                inst.settings.reset();
            }, 'del')},
            preview: (inst) => { return new HC.Hotkey('home', (e) => {
                this.messaging.program.updateControl('preview', !this.config.ControlSettings.preview, true, true, false);
            }, 'hm')},
            push_layers: (inst) => { return new HC.Hotkey('end', (e) => {
                inst.settings.push_layers();
            }, 'end')},
            push_sources: (inst) => { return new HC.Hotkey('pagedown', (e) => {
                inst.settings.push_sources();
            }, 'pgd')},
            rst_shaders: (inst) => { return new HC.Hotkey('pageup,shift+pageup', (e) => {
                inst.settings.rst_shaders();
            }, 'pgu')},
        };
    }
}