/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ControlSet, IterableControlSet} from "../../shared/ControlSet";

class override extends ControlSet
{
    static index = 10;

    settings = {
        override_material_input: 'none',
        override_background_mode: 'none',
    };

    types = {

    };

    styles = {
        override_material_input: [''],
        override_background_mode: ['']
    };

    values = {

    };
}

class source extends ControlSet
{
    static index = 20;

    settings = {
        group0: '',
        group1: ''
    };

    types = {

    };

    styles = {
        display_source: ['half', 'clear'],
        display_sequence: ['half'],

        group0: ['half', 'clear'],
        group1: ['half'],

        seq_0: ['hex', 'clear'],
        seq_1: ['hex'],
        seq_2: ['hex'],
        seq_3: ['hex'],
        seq_4: ['hex'],
        seq_inc: ['hex'],
    };

    values = {
        display_source: 'renderer',
        display_sequence: 0
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

        this.createGroupSettings(pluggedValues);

        // create source settings
        this.createSourceSettings(pluggedValues);

        // append seq buttons
        this.appendSeqButtons();

    }

    /**
     *
     * @param pluggedValues
     */
    createGroupSettings(pluggedValues) {
        let _create = (value, group) => {
            return () => {
                this.program.setAllDisplaysTo('source', value, group);
            }
        };
        let _add = (group) => {
            let first = true;
            for (let k in pluggedValues.display_source) {
                let key = group.replace('roup', '') + k;
                this.styles[key] = ['hex'];
                if (first) {
                    this.styles[key][1] = 'clear';
                    first = false;
                }
                this.settings[key] = _create(k, group);
            }
        };

        _add('group0');
        _add('group1');
    }

    /**
     *
     * @param pluggedValues
     */
    createSourceSettings(pluggedValues) {
        let okey = 'display';
        for (let i = 0; i < this.config.DisplayValues.display.length; i++) {

            let key = 'display' + i;

            // settings
            this.settings[key + '_source'] = this.values[okey + '_source'];
            this.settings[key + '_sequence'] = this.values[okey + '_sequence'];

            // values
            this.values[key + '_source'] = pluggedValues['display_source'];
            this.values[key + '_sequence'] = pluggedValues['sequence'];

            // types
            this.types[key + '_source'] = this.types[okey + '_source'];
            this.types[key + '_sequence'] = this.types[okey + '_sequence'];

            // styles
            this.styles[key + '_source'] = this.styles[okey + '_source'];
            this.styles[key + '_sequence'] = this.styles[okey + '_sequence'];

        }
    }

    /**
     *
     */
    appendSeqButtons() {
        this.settings.seq_0 = () => {
            this.program.setAllDisplaysTo('sequence', 0);
        };
        this.settings.seq_1 = () => {
            this.program.setAllDisplaysTo('sequence', 1);
        };
        this.settings.seq_2 = () => {
            this.program.setAllDisplaysTo('sequence', 2);
        };
        this.settings.seq_3 = () => {
            this.program.setAllDisplaysTo('sequence', 3);
        };
        this.settings.seq_4 = () => {
            this.program.setAllDisplaysTo('sequence', 4);
        };
        this.settings.seq_inc = () => {
            this.program.setAllDisplaysTo('sequence', false);
        };


    }
}

class sequenceN extends IterableControlSet
{
    static index = 40;
    prefix = 'sequence';
    folders = [];
    settings = {
        sequence_input: 'off',
        sequence_overlay: 'off',
        sequence_brightness: 1.0,
        sequence_blendmode: '0',
        sequence_osci: 'off',
        sequence_speed: 1.0,
        sequence_start: 0,
        sequence_end: 0,
        sequence_jump: false,
        sequence_audio: false,
        sequence_flipx: false,
        sequence_flipy: false,
        sequence_flipa: false,
        sequence_reversed: false,
        sequence_speedup: false,
        sequence_speeddown: false,
        sequence_passthrough: false,
    };

    types = {
        sequence_brightness: [0, 1, 0.02],
        sequence_speed: [-2, 2, 0.1],
        sequence_start: [0, 100, 1, 'hidden'],
        sequence_end: [0, 100, 1, 'hidden'],
        sequence_X: ['hidden'],
        sequence_XX: ['hidden'],
    };

    styles = {
        sequence_speed: ['half'],
        sequence_osci: ['half', 'clear'],
        sequence_X: ['half'],
        sequence_XX: ['half'],
        sequence_jump: ['quint'],
        sequence_audio: ['quint'],
        sequence_reversed: ['quarter'],
        sequence_speedup: ['quarter'],
        sequence_speeddown: ['quarter'],
        sequence_flipx: ['quint'],
        sequence_flipy: ['quint'],
        sequence_flipa: ['quint'],
        sequence_passthrough: ['quarter'],
        sequence_input: ['half', 'clear'],
        sequence_overlay: ['half'],
        sequence_blendmode: ['half'],
        sequence_brightness: ['half', 'clear'],
    };

    values = {
        sequence_osci: 'oscillator',
        sequence_input: 'input',
        sequence_overlay: 'overlay',
        sequence_blendmode: 'blendmode',
    };

    prefixes = {

    };

    parents = {
        sequence_input: '',
        sequence_overlay: '',
        sequence_brightness: '',
        sequence_blendmode: '',
        sequence_osci: '',
        sequence_speed: '',
        sequence_start: '',
        sequence_end: '',
        sequence_jump: '',
        sequence_audio: '',
        sequence_flipx: '',
        sequence_flipy: '',
        sequence_flipa: '',
        sequence_reversed: '',
        sequence_speedup: '',
        sequence_speeddown: '',
        sequence_passthrough: '',
    };

    createSettings(pluggedValues) {
        for (let member in this.members) {
            this[member] = {};
        }

        for (let k in this.members.values) {
            let key = this.members.values[k];
            this.members.values[k] = this.config.SourceValues[key];
        }

        for (let i = 0; i < pluggedValues[this.prefix].length; i++) {
            this._create('settings', i, this.members.settings);
            this._create('types', i, this.members.types);
            this._create('styles', i, this.members.styles);
            this._create('values', i, this.members.values);
            this._create('parents', i, this.members.parents, this.prefix + i);
            this._create('folders', i, {sequence: true});
            this.createResets(i, pluggedValues);
        }
    }

    /**
     *
     * @param index
     * @param pluggedValues
     */
    createResets(index, pluggedValues) {
        let _reset = (seq) => {
            let key = getSequenceKey(seq);
            this.settings[key +  '_X'] = () => {
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

                this.program.updateSources(updates, true, false, false);
                this.config.getMessaging().emitSources(updates, true, true, false);
            };
        };

        _reset(index);

        let _rereset = (seq) => {
            let key = getSequenceKey(seq);
            this.settings[key +  '_XX'] = () => {
                let updates = {};
                updates[key + '_overlay'] = this.settings[key + '_overlay'];
                updates[key + '_input'] = this.settings[key + '_input'];
                updates[key + '_blendmode'] = this.settings[key + '_blendmode'];
                updates[key + '_osci'] = this.settings[key + '_osci'];
                updates[key + '_brightness'] = this.settings[key + '_brightness'];

                this.program.updateSources(updates, true, false, false);
                this.config.getMessaging().emitSources(updates, true, true, false);
            };
        };

        _rereset(index);
    }
}

class sample extends ControlSet
{
    static index = 20;

    settings = {
        sample0_enabled: false,
        sample0_record: false,
        sample0_beats: 4,
        sample1_enabled: false,
        sample1_record: false,
        sample1_beats: 4,
        sample2_enabled: false,
        sample2_record: false,
        sample2_beats: 4,
        sample3_enabled: false,
        sample3_record: false,
        sample3_beats: 4,
        sample4_enabled: false,
        sample4_record: false,
        sample4_beats: 4,
        sample5_enabled: false,
        sample5_record: false,
        sample5_beats: 4,
        sample0_load: false,
        sample1_load: false,
        sample2_load: false,
        sample3_load: false,
        sample4_load: false,
        sample5_load: false,
    };

    types = {
        sample0_load: ['hidden'],
        sample1_load: ['hidden'],
        sample2_load: ['hidden'],
        sample3_load: ['hidden'],
        sample4_load: ['hidden'],
        sample5_load: ['hidden'],

    };

    styles = {
        bts_2: ['quint'],
        bts_4: ['quint'],
        bts_8: ['quint'],
        bts_16: ['quint'],
        bts_32: ['quint'],
    };

    values = {
    };

    init(pluggedValues) {
        this.createValues(pluggedValues);
        super.init(pluggedValues);
    }

    createValues(pluggedValues) {
        this.createSampleValues(pluggedValues);
    }

    createSampleValues(pluggedValues) {
        for (let i in pluggedValues.sample) {
            let beatKey = getSampleBeatKey(i);
            this.values[beatKey] = pluggedValues.beats;
        }
    }
}

export {override, source, sequenceN, sample}