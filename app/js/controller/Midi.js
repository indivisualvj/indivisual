/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {TimeoutManager} from "../manager/TimeoutManager";
import {Messaging} from "../lib/Messaging";

class Midi {

    /**
     * @type {Controller}
     */
    controller;

    midi;

    data;

    assignment;

    /**
     *
     * @type {*[]}
     */
    cache = [];
    /**
     *
     * @type {{}}
     */
    midi_glow = {};
    /**
     *
     * @type {{}}
     */
    midi_timeouts = {};
    /**
     *
     * @type {{}}
     */
    midi_shifted = {};
    /**
     *
     * @type {{}}
     */
    midi_pressed = {};

    /**
     *
     */
    config;

    /**
     *
     * @param {Controller} controller
     */
    constructor(controller) {
        this.controller = controller;
        this.config = controller.config;

    }

    init() {

        // request MIDI access
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false,
                software: true
            }).then((e) => {this._onSuccess(e);}, (e) => {this._onFailure(e);});
        } else {
            console.warn("No MIDI support in your browser. If you're not on localhost, try enabling SSL.");
        }
    }

    /**
     *
     * @param midiAccess
     * @private
     */
    _onSuccess(midiAccess) {
        // when we get a succesful response, run this code
        this.midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
        console.log('MIDI access available');

        let _updateControlSet = (input, settings) => {
            let constants = settings.constants;
            for (let c in constants) {
                window[c] = constants[c];
            }

            input.value._controlSet = settings;
        };

        let _onStateChange = () => {
            if (this.midi.onstatechange == null){
                return;
            }

            this.midi.onstatechange = null;
            let inputs = this.midi.inputs.values();
            let success = false;
            //loop over all available inputs and listen for any MIDI input
            for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                // each time there is a this.midi message call the onMIDIMessage function
                if (!success) {
                    console.log('MIDI devices available:');
                    success = true;
                }

                // _check for valid ControlSet by MIDI Device name
                let name = input.value.name;
                if (name in this.config.MidiController) {
                    _updateControlSet(input, this.config.MidiController[name]);
                } else {
                    // _check for valid ControlSet by MIDI Device manufacturer
                    name = input.value.manufacturer;
                    if (name in this.config.MidiController) {
                        _updateControlSet(input, this.config.MidiController[name]);

                    } else {
                        _updateControlSet(input, this.config.MidiController['Default']);
                    }
                }

                console.log(name, input.value);
                input.value.onmidimessage = (e) => {this._onMessage(e);};

            }
            if (!success) {
                console.log('no MIDI devices connected');
            }

            setTimeout(() => {
                this.midi.onstatechange = _onStateChange;
            }, 2500);
        };
        this.midi.onstatechange = _onStateChange;
        _onStateChange();
    }


    /**
     *
     * @param dat
     * @private
     */
    _send(dat) {
        let outputs = this.midi.outputs.values();
        for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
            let port = output.value.id;
            let out = this.midi.outputs.get(port);
            if (out) {
                out.send(dat);
            }
        }
    }

    /**
     *
     * @param error
     * @private
     */
    _onFailure(error) {
        // when we get a failed response, run this code
        console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
    }

    /**
     *
     * @param dat
     * @returns {string}
     * @private
     */
    _dataId(dat) {
        return dat[0] + '' + dat[1];
    }

    /**
     *
     * @param message
     * @private
     */
    _onMessage(message) {
        this.data = message.data; // this gives us our [command/channel, note, velocity] data.

        let dataId = this._dataId(this.data);
        if (this.data[2] === 127) {
            this.midi_pressed[dataId] = this.data[2];
            clearTimeout(this.midi_timeouts[dataId]);

        } else if (this.midi_pressed[dataId]) {
            delete this.midi_pressed[dataId];
        }

        if (this.data.length < 2) return;
        // console.log('', this.data); // MIDI data [144, 63, 73]

        Messaging.emitMidi('message', this.data, {});

        let cmd = this.data[0];
        let id = this.data[1];
        let vel = (2 in this.data ? this.data[2] : 127);

        if (vel === 126 || vel === 1) { // glow/off
            return;
        }

        let shifts = Object.keys(this.midi_shifted);

        if (cmd in message.currentTarget._controlSet) {
            let ctrlSet = message.currentTarget._controlSet;
            cmd = ctrlSet[cmd];

            if (id in cmd) {

                id = cmd[id];
                let shift = '';
                let shiftTo = 'default';
                //if (vel) {
                for (let i = 0; i < shifts.length; i++) {
                    if (this.midi_shifted[shifts[i]]) {
                        shiftTo = shifts[i];
                        shift = this.midi_shifted[shifts[i]];

                        if (id.default && id.default.shift === shiftTo) {
                            shift = '';
                            shiftTo = 'default';
                        }

                        break;
                    }
                }
                //}
                if (shiftTo in id) {
                    id = id[shiftTo];

                    let settings = id.section + 'Settings';
                    let values = id.section + 'Values';
                    let types = id.section + 'Types';
                    let func = 'update' + id.section;
                    let name = shift + id.name;

                    if (func in this.controller) {
                        func = this.controller[func];
                        if (settings in this.config) {
                            settings = this.config[settings];
                            if (!(name in settings) && id.name in settings) {
                                name = id.name;
                            }

                            this._switchType(id, name, vel, settings, values, types, func, message.timeStamp, ctrlSet);
                        }
                    }
                } else {
                    HC.log('midi_miss', this.data);
                }
            } else {
                HC.log('midi_miss', this.data);
            }
        } else {
            HC.log('midi_miss', this.data);
        }
    }

    /**
     *
     * @param id
     * @param name
     * @param vel
     * @param settings
     * @param values
     * @param types
     * @param func
     * @param timestamp
     * @param ctrlSet
     * @private
     */
    _switchType(id, name, vel, settings, values, types, func, timestamp, ctrlSet) {

        let last = (values + name) in this.cache ? this.cache[values + name] : [0, 0, 0];
        let tdiff = timestamp - last[1];

        if (tdiff < 5) {
            return;
        }

        let blast = false;
        let step = Math.max(58, Math.min(70, vel)) - 64;

        if (!id.options) {
            id.options = {};
        }

        // acceleration highlight
        if (Math.abs(step) > 1) {
            id.options.color = 'red';
        } else {
            id.options.color = '';
        }

        this.cache[values + name] = [step, timestamp, blast];

        switch (id.type) {
            case 'status':
                let status = id.data;
                if (values in this.config && status in this.config) {
                    values = this.config[values];
                    status = this.config[status];

                    let enable = vel ? id.name : false;
                    if (enable) {
                        this._showOSD(id.type,id.name + 'N' + id.suffix);
                    } else {
                        this._hideOSD(id.type);
                    }
                    if (name in values) {
                        values = values[name];
                        let keys = Object.keys(values);
                        for (let i = 0; i < keys.length; i++) {
                            let n = id.name + i;
                            if (id.suffix) {
                                n += id.suffix;
                            }
                            let ass = [this.data[0], id.start + i];
                            if (enable && n in status && status[n]) {
                                this._glow(ass);
                            } else {
                                this._off(ass);
                            }
                        }
                    }
                }
                break;

            case 'shift':
                let enable = vel ? id.name : false;
                let wasshifted = this.midi_shifted[id.shift];
                this.midi_shifted[id.shift] = enable;
                if (enable) {
                    this._showOSD(id.type, id.shift + '/' + enable, false);

                    // search for this.assignment and send
                    this.assignment = this._findMidiAssignment(id, name, settings, values, types, ctrlSet);
                    if (this.assignment !== false) {
                        this._glow(this.assignment);
                    }

                } else {
                    this._hideOSD(id.type);
                    if (wasshifted) {
                        this._off(this.assignment);
                    }
                }

                break;

            case 'select':
                if (values in this.config) {
                    values = this.config[values];

                    if (name in values) {

                        values = values[name];
                        let keys = Object.keys(values);
                        let min = 0;
                        let max = keys.length - 1;
                        let unit = 1;
                        step = (step) > 0 ? 1 : -1;
                        let cur = settings[name];
                        cur = keys.indexOf('' + cur);
                        //cur = !isNaN(parseInt(cur)) ? parseInt(cur) : keys.indexOf(cur);
                        let next = cur + (step * unit);

                        let value = Math.max(min, Math.min(max, next));

                        value = keys[value];

                        value = !isNaN(parseInt(value)) ? parseInt(value) : value;
                        let display = values[value];

                        func.call(this.controller, name, value, true, true, false);
                        this._showOSD(name, display, OSD_TIMEOUT);
                    }
                }
                break;

            case 'volume':
            case 'step':
                if (types in (this.config)) {
                    types = this.config[types];
                    if (name in types) {
                        types = types[name];

                        let min = types[0];
                        let max = types[1];
                        let unit = types[2];

                        if (id.options && id.options.unit) {
                            unit = id.options.unit;
                        }

                        let cur = settings[name];
                        let next = cur + (step * unit);

                        if (id.type === 'step') {
                            step = step > 0 ? unit : -unit;
                        }

                        let value = Math.max(min, Math.min(max, next));

                        func.call(this.controller, name, round(value, 3), true, true, false);
                        this._showOSD(name, value, OSD_TIMEOUT, id);

                        //this.data = [step, timestamp, diff];
                    }
                }
                break;

            case 'function':
                if (vel) {
                    func = settings[name];
                    func.call(this.controller, name, true, true, true, false);
                    this._showOSD(name, true, false);

                } else {
                    this._hideOSD(name);
                }
                break;

            case 'toggle':
                if (vel || vel === undefined) {
                    let current = settings[name];
                    let value = !current;

                    func.call(this.controller, name, value, true, true, false);
                    this._showOSD(name, value, false);

                } else {
                    this._hideOSD(name);
                }
                break;

            case 'boolean':
                if (vel || vel === undefined) {

                    let step = vel - 64;
                    let value = step > -1 ? true : false;
                    func.call(this.controller, name, value, true, true, false);
                    this._showOSD(name, value, OSD_TIMEOUT, id);

                } else {
                    this._hideOSD(name);
                }
                break;

            case 'push':
                let value = vel > 0;
                func.call(this.controller, name, value, true, true, false);
                if (value) {
                    this._showOSD(name, value, false);

                } else {
                    this._hideOSD(name);
                }
                break;

            case 'assign':
                if (vel) {
                    let value = id.value;

                    func.call(this.controller, name, value, true, true, false);
                    this._showOSD(name, value, false);

                } else {
                    this._hideOSD(name);
                }
                break;
        }
    }

    /**
     *
     * @param name
     * @param value
     * @param timeout
     * @param id
     * @private
     */
    _showOSD(name, value, timeout, id) {

        if (id && id.options && id.options.silent) {
            return;
        }

        this.controller.showOSD(name, value, timeout, ((id && id.options && id.options.color) ? id.options.color : false));
    }

    /**
     *
     * @param id
     * @param name
     * @param settings
     * @param values
     * @param types
     * @param ctrlSet
     * @returns {boolean|number[]}
     * @private
     */
    _findMidiAssignment(id, name, settings, values, types, ctrlSet) {

        for (let m in ctrlSet) {
            m = parseInt(m);
            let sub = ctrlSet[m];
            for (let s in sub) {
                s = parseInt(s);
                let c = sub[s];
                if (id.shift in c) {
                    let sec = c[id.shift];
                    if (sec.type === 'assign') {
                        let n = sec.name;
                        let v = sec.value;
                        let setting = name + n;
                        let sv;
                        try {
                            sv = settings[setting]
                        } catch (e) {
                            console.log(id, name, setting, e);
                        }
                        if (sv !== null) {
                            if (sv == v) { // keep it like this
                                return [m, s];
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    /**
     *
     * @param dat
     * @param conf
     * @private
     */
    _glow(dat, conf) {
        if (this.midi && dat) {

            let key = this._dataId(dat);
            let pressed = this.midi_pressed[key];
            let glowing = this.midi_glow[key];
            let delay = conf && conf.delay ? conf.delay : 0;
            let timeout = conf && conf.timeout ? delay + conf.timeout : 0;

            if (!pressed && !glowing) {
                //let outputs = this.midi.outputs.values();
                let noteon = [dat[0], dat[1], 126];

                if (delay) { // start glowing after delay
                    this.midi_timeouts[key] = setTimeout(() => {
                        this._send(noteon);
                    }, delay);

                } else { // start glowing now
                    this._send(noteon);
                }

                if (timeout) { // stop glowing after timeout
                    this.midi_timeouts[key] = setTimeout(() => {
                        this._off([dat[0], dat[1]], true);
                        if (conf.times) {
                            conf.times--;
                            this.midi_timeouts[key] = setTimeout(() => {
                                this._glow(dat, conf)
                            }, timeout);
                        }
                    }, timeout);

                } else { // block
                    clearTimeout(this.midi_timeouts[key]);
                    this.midi_glow[key] = true;
                }
            }

        }
    }

    /**
     *
     * @param name
     * @private
     */
    _hideOSD(name) {
        this.controller.showOSD(name, undefined, 50);
    }

    /**
     *
     * @param dat
     * @param keep
     * @private
     */
    _off(dat, keep) {
        if (this.midi && dat) {
            // let outputs = this.midi.outputs.values();
            let noteoff = [dat[0], dat[1], 1];

            this._send(noteoff);

            // if (!keep) {
                let key = dat[0] + '' + dat[1];
                this.midi_glow[key] = false;
            // }
        }
    }

    /**
     *
     * @param id
     * @param conf
     */
    glow(id, conf) {
        this._glow(id, conf);
    }

    /**
     *
     * @param id
     */
    off(id) {
        this._off(id);
    }

    loading(_status) {
        let rowOne = MIDI_ROW_ONE;
        let rowTwo = MIDI_ROW_TWO;
        let rol = Object.keys(rowOne).length;
        let rtl = Object.keys(rowTwo).length;

        let timeout = SKIP_TEN_FRAMES*2;
        let delay = SKIP_FIVE_FRAMES;

        let _circle = () => {
            let counter = 0;
            for (let i = 0; i < rol; i++) {
                this.glow(rowOne[i], {
                    delay: (counter++)*delay,
                    timeout: timeout
                });
            }
            for (let i = rtl-1; i >= 0; i--) {
                this.glow(rowTwo[i], {
                    delay: (counter++)*delay,
                    timeout: timeout
                });
            }

            if (!_status()) {
                TimeoutManager.add('loading', (rtl + rol)*delay , () => {
                    _circle();
                });
            }
        }
        _circle();
    }
}

export {Midi}