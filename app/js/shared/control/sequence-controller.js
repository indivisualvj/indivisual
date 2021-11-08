/**
 * @author indivisualvj / https://github.com/indivisualvj
 */


HC.SequenceController = HC.SequenceController || {};

{
    /**
     *
     * @type {HC.SequenceController.sequence}
     */
    HC.SequenceController.sequence = class sequence extends HC.ControlSet {
        static index = 20;

        settings = {
            sequence0_input: 'off',
            sequence0_overlay: 'off',
            sequence0_brightness: 1.0,
            sequence0_blendmode: '0',
            sequence1_input: 'off',
            sequence1_overlay: 'off',
            sequence1_brightness: 1.0,
            sequence1_blendmode: '0',
            sequence2_input: 'off',
            sequence2_overlay: 'off',
            sequence2_brightness: 1.0,
            sequence2_blendmode: '0',
            sequence3_input: 'off',
            sequence3_overlay: 'off',
            sequence3_brightness: 1.0,
            sequence3_blendmode: '0',
            sequence4_input: 'off',
            sequence4_overlay: 'off',
            sequence4_brightness: 1.0,
            sequence4_blendmode: '0',
            sequence0_osci: 'off',
            sequence0_speed: 1.0,
            sequence1_osci: 'off',
            sequence1_speed: 1.0,
            sequence2_osci: 'off',
            sequence2_speed: 1.0,
            sequence3_osci: 'off',
            sequence3_speed: 1.0,
            sequence4_osci: 'off',
            sequence4_speed: 1.0,
            sequence0_start: 0,
            sequence1_start: 0,
            sequence2_start: 0,
            sequence3_start: 0,
            sequence4_start: 0,
            sequence0_end: 0,
            sequence1_end: 0,
            sequence2_end: 0,
            sequence3_end: 0,
            sequence4_end: 0,
            sequence0_jump: false,
            sequence1_jump: false,
            sequence2_jump: false,
            sequence3_jump: false,
            sequence4_jump: false,
            sequence0_audio: false,
            sequence1_audio: false,
            sequence2_audio: false,
            sequence3_audio: false,
            sequence4_audio: false,
            sequence0_reversed: false,
            sequence1_reversed: false,
            sequence2_reversed: false,
            sequence3_reversed: false,
            sequence4_reversed: false,
            sequence0_speedup: false,
            sequence1_speedup: false,
            sequence2_speedup: false,
            sequence3_speedup: false,
            sequence4_speedup: false,
            sequence0_speeddown: false,
            sequence1_speeddown: false,
            sequence2_speeddown: false,
            sequence3_speeddown: false,
            sequence4_speeddown: false,
            sequence0_flipx: false,
            sequence1_flipx: false,
            sequence2_flipx: false,
            sequence3_flipx: false,
            sequence4_flipx: false,
            sequence0_flipy: false,
            sequence1_flipy: false,
            sequence2_flipy: false,
            sequence3_flipy: false,
            sequence4_flipy: false,
            sequence0_flipa: false,
            sequence1_flipa: false,
            sequence2_flipa: false,
            sequence3_flipa: false,
            sequence4_flipa: false,
            sequence0_passthrough: false,
            sequence1_passthrough: false,
            sequence2_passthrough: false,
            sequence3_passthrough: false,
            sequence4_passthrough: false,
        };

        types = {
            sequence0_brightness: [0, 1, 0.02],
            sequence1_brightness: [0, 1, 0.02],
            sequence2_brightness: [0, 1, 0.02],
            sequence3_brightness: [0, 1, 0.02],
            sequence4_brightness: [0, 1, 0.02],
            sequence0_speed: [-2, 2, 0.1],
            sequence1_speed: [-2, 2, 0.1],
            sequence2_speed: [-2, 2, 0.1],
            sequence3_speed: [-2, 2, 0.1],
            sequence4_speed: [-2, 2, 0.1],
            sequence0_start: [0, 100, 1, 'hidden'],
            sequence1_start: [0, 100, 1, 'hidden'],
            sequence2_start: [0, 100, 1, 'hidden'],
            sequence3_start: [0, 100, 1, 'hidden'],
            sequence4_start: [0, 100, 1, 'hidden'],
            sequence0_end: [0, 100, 1, 'hidden'],
            sequence1_end: [0, 100, 1, 'hidden'],
            sequence2_end: [0, 100, 1, 'hidden'],
            sequence3_end: [0, 100, 1, 'hidden'],
            sequence4_end: [0, 100, 1, 'hidden'],
        };
        
        styles = {
            sequence0_speed: ['half'],
            sequence1_speed: ['half'],
            sequence2_speed: ['half'],
            sequence3_speed: ['half'],
            sequence4_speed: ['half'],
            sequence0_osci: ['half', 'clear'],
            sequence1_osci: ['half', 'clear'],
            sequence2_osci: ['half', 'clear'],
            sequence3_osci: ['half', 'clear'],
            sequence4_osci: ['half', 'clear'],
            sequence0_reset: ['quarter'],
            sequence1_reset: ['quarter'],
            sequence2_reset: ['quarter'],
            sequence3_reset: ['quarter'],
            sequence4_reset: ['quarter'],
            sequence0_rereset: ['quarter'],
            sequence1_rereset: ['quarter'],
            sequence2_rereset: ['quarter'],
            sequence3_rereset: ['quarter'],
            sequence4_rereset: ['quarter'],
            sequence0_jump: ['hex'],
            sequence1_jump: ['hex'],
            sequence2_jump: ['hex'],
            sequence3_jump: ['hex'],
            sequence4_jump: ['hex'],
            sequence0_audio: ['hex'],
            sequence1_audio: ['hex'],
            sequence2_audio: ['hex'],
            sequence3_audio: ['hex'],
            sequence4_audio: ['hex'],
            sequence0_reversed: ['hex'],
            sequence1_reversed: ['hex'],
            sequence2_reversed: ['hex'],
            sequence3_reversed: ['hex'],
            sequence4_reversed: ['hex'],
            sequence0_speedup: ['hex'],
            sequence1_speedup: ['hex'],
            sequence2_speedup: ['hex'],
            sequence3_speedup: ['hex'],
            sequence4_speedup: ['hex'],
            sequence0_speeddown: ['hex'],
            sequence1_speeddown: ['hex'],
            sequence2_speeddown: ['hex'],
            sequence3_speeddown: ['hex'],
            sequence4_speeddown: ['hex'],
            sequence0_flipx: ['hex'],
            sequence1_flipx: ['hex'],
            sequence2_flipx: ['hex'],
            sequence3_flipx: ['hex'],
            sequence4_flipx: ['hex'],
            sequence0_flipy: ['hex'],
            sequence1_flipy: ['hex'],
            sequence2_flipy: ['hex'],
            sequence3_flipy: ['hex'],
            sequence4_flipy: ['hex'],
            sequence0_flipa: ['hex'],
            sequence1_flipa: ['hex'],
            sequence2_flipa: ['hex'],
            sequence3_flipa: ['hex'],
            sequence4_flipa: ['hex'],
            sequence0_passthrough: ['third'],
            sequence1_passthrough: ['third'],
            sequence2_passthrough: ['third'],
            sequence3_passthrough: ['third'],
            sequence4_passthrough: ['third'],
            sequence0_input: ['half', 'clear'],
            sequence1_input: ['half', 'clear'],
            sequence2_input: ['half', 'clear'],
            sequence3_input: ['half', 'clear'],
            sequence4_input: ['half', 'clear'],
            sequence0_overlay: ['half'],
            sequence1_overlay: ['half'],
            sequence2_overlay: ['half'],
            sequence3_overlay: ['half'],
            sequence4_overlay: ['half'],
            sequence0_blendmode: ['half'],
            sequence1_blendmode: ['half'],
            sequence2_blendmode: ['half'],
            sequence3_blendmode: ['half'],
            sequence4_blendmode: ['half'],
            sequence0_brightness: ['half', 'clear'],
            sequence1_brightness: ['half', 'clear'],
            sequence2_brightness: ['half', 'clear'],
            sequence3_brightness: ['half', 'clear'],
            sequence4_brightness: ['half', 'clear'],
        };

        values = {

        };

        init(pluggedValues) {
            this.createSettings(pluggedValues);
            super.init(pluggedValues);
        }

        /**
         *
         * @param pluggedValues
         */
        createSettings(pluggedValues) {

            for (let k in pluggedValues.sequence) {

                this.values['sequence' + k + '_input'] = pluggedValues.input;
                this.values['sequence' + k + '_overlay'] = pluggedValues.overlay;
                this.values['sequence' + k + '_blendmode'] = pluggedValues.blendmode;
                this.values['sequence' + k + '_osci'] = pluggedValues.oscillator;
            }

            this.createResets(pluggedValues);
        }

        /**
         *
         * @param pluggedValues
         */
        createResets(pluggedValues)  {
            let _reset = (seq) => {
                let key = getSequenceKey(seq);
                this.settings[key + '_reset'] = () => {
                    let updates = {};
                    updates[key + '_jump'] = false;
                    updates[key + '_audio'] = false;
                    updates[key + '_flipa'] = false;
                    updates[key + '_flipx'] = false;
                    updates[key + '_flipy'] = false;
                    updates[key + '_speedup'] = false;
                    updates[key + '_speeddown'] = false;
                    updates[key + '_reversed'] = false;
                    updates[key + '_passthrough'] = false;
                    updates[key + '_speed'] = 1.0;

                    updates[getSequenceStartKey(seq)] = 0;

                    let endKey = getSequenceEndKey(seq);
                    updates[endKey] = 0;

                    messaging.program.updateSources(updates, true, false, false);
                    messaging.emitSources(updates, true, true, false);
                };
            };

            _reset(0);
            _reset(1);
            _reset(2);
            _reset(3);
            _reset(4);

            let _rereset = (seq) => {
                let key = getSequenceKey(seq);
                this.settings[key + '_rereset'] = () => {
                    let updates = {};
                    updates[key + '_overlay'] = this.settings[key + '_overlay'];
                    updates[key + '_input'] = this.settings[key + '_input'];
                    updates[key + '_blendmode'] = this.settings[key + '_blendmode'];
                    updates[key + '_osci'] = this.settings[key + '_osci'];
                    updates[key + '_brightness'] = this.settings[key + '_brightness'];

                    messaging.program.updateSources(updates, true, false, false);
                    messaging.emitSources(updates, true, true, false);
                };
            };

            _rereset(0);
            _rereset(1);
            _rereset(2);
            _rereset(3);
            _rereset(4);
        }
    }
}
