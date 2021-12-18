/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ControlSet} from "../../shared/ControlSet";
import {Hotkey} from "../../shared/Event";

class session extends ControlSet {
    static index = 10;

    settings = {
        session: 'root'
    };

    types = {};

    styles = {};
}

class controls extends ControlSet {
    static index = 20;

    open = true;

    settings = {
        play: true,

        reset: () => {
            if (Hotkey.isPressed('shift') && Hotkey.isPressed('ctrl')) {
                let yes = confirm('Reset everything?');
                if (yes) {
                    this.program.fullReset();
                }
            } else if (Hotkey.isPressed('shift')) {
                let _done = false;
                this.program.midi.loading(() => { // todo: no direct access to midi
                    return _done;
                });
                this.program.resetLayers().finally(() => {
                    _done = true;
                });

            } else {
                this.program.updateControl('reset', true, true, true, false);
            }
        },

        preview: false,
        push_layers: () => {
            this.program.pushLayers();
        },
        push_sources: () => {
            this.program.pushSources();
        },
        rst_shaders: () => {
            this.program.resetShaders(Hotkey.isPressed('shift')).finally(() => {
            });
        },
        enable_mic: () => {
            this.program.updateControl('audio', 'microphone', true, true, false);
        },
        reset_overrides: () => {
            this.program.updateSource('override_material_input', 'none', true, true, false);
            this.program.updateSource('override_background_mode', 'none', true, true, false);
        },
        layout_close: () => {
            this.program.closeAll();
        },
        layout_control: () => {
            this.program.closeAll();
            this.program.openTreeByPath('controls');
        },
        layout_display: () => {
            this.program.closeAll();
            this.program.openTreeByPath('displays/_general');
        },
        layout_source: () => {
            this.program.closeAll();
            this.program.openTreeByPath('source');
        },
        layout_override: () => {
            this.program.closeAll();
            this.program.openTreeByPath('override');
        },
        layout_animation: () => {
            this.program.closeAll();
            let control = this.program.guis[3];
            control.setOpen(true);
        },
        layout_sequence: () => {
            this.program.closeAll();
            let control = this.program.guis[4];
            this.program.openAll(control);
        },
        layout_presets: () => {
            this.program.closeAll();
            this.program.toggleByKey(5);
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
            return new Hotkey('ctrl+shift+f9', (e) => {
                this.settings.enable_mic();
            });
        },
        reset_overrides: (inst) => {
            return new Hotkey('ctrl+shift+f10', (e) => {
                this.settings.reset_overrides();
            });
        },
        layout_control: (inst) => {
            return new Hotkey('ctrl+1', (e) => {
                this.settings.layout_control();
            });
        },
        layout_display: (inst) => {
            return new Hotkey('ctrl+2', (e) => {
                this.settings.layout_display();
            });
        },
        layout_source: (inst) => {
            return new Hotkey('ctrl+3', (e) => {
                this.settings.layout_source();
            });
        },
        layout_override: (inst) => {
            return new Hotkey('ctrl+4', (e) => {
                this.settings.layout_override();
            });
        },
        layout_animation: (inst) => {
            return new Hotkey('ctrl+5', (e) => {
                this.settings.layout_animation();
            });
        },
        layout_sequence: (inst) => {
            return new Hotkey('ctrl+6', (e) => {
                this.settings.layout_sequence();
            });
        },
        layout_presets: (inst) => {
            return new Hotkey('ctrl+7', (e) => {
                this.settings.layout_presets();
            });
        },
        layout_close: (inst) => {
            return new Hotkey('ctrl+0', (e) => {
                this.settings.layout_close();
            });
        },
        play: (inst) => {
            return new Hotkey('space', (e) => {
                this.program.updateControl('play', !this.config.ControlSettings.play, true, true, false);
            }, 'spc')
        },
        reset: (inst) => {
            return new Hotkey('delete,shift+delete,ctrl+shift+delete', (e) => {
                inst.settings.reset();
            }, 'del')
        },
        preview: (inst) => {
            return new Hotkey('home', (e) => {
                this.program.updateControl('preview', !this.config.ControlSettings.preview, true, true, false);
            }, 'hm')
        },
        push_layers: (inst) => {
            return new Hotkey('end', (e) => {
                inst.settings.push_layers();
            }, 'end')
        },
        push_sources: (inst) => {
            return new Hotkey('pagedown', (e) => {
                inst.settings.push_sources();
            }, 'pgd')
        },
        rst_shaders: (inst) => {
            return new Hotkey('pageup,shift+pageup', (e) => {
                inst.settings.rst_shaders();
            }, 'pgu')
        },
    };
}

export {controls, session}