/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

/**
 *
 * @param instance
 */
HC.Controller.prototype.initMidi = function (instance) {
    var midi, data, assignment, clockcounter = 0, clockbpm, clockfirst, cache = [];
    var midi_glow = {};
    var midi_timeouts = {};
    var midi_shifted = {};
    var midi_pressed = {};

    // request MIDI access
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: false,
            software: true
        }).then(_onSuccess, _onFailure);
    } else {
        console.error("No MIDI support in your browser.");
    }

    /**
     *
     * @param midiAccess
     * @private
     */
    function _onSuccess(midiAccess) {
        // when we get a succesful response, run this code
        midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
        console.log('MIDI access available');
        var _onStateChange = function () {
            if (midi.onstatechange == null) return;
            midi.onstatechange = null;
            var inputs = midi.inputs.values();
            var success = false;
            //loop over all available inputs and listen for any MIDI input
            for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                // each time there is a midi message call the onMIDIMessage function
                if (!success) {
                    console.log('MIDI devices available:');
                    success = true;
                }

                console.log(input.value.name, input.value);
                input.value.onmidimessage = _onMessage;

            }
            if (!success) {
                console.log('no MIDI devices connected');
            }

            setTimeout(function () {
                midi.onstatechange = _onStateChange;
            }, 2500);
        };
        midi.onstatechange = _onStateChange;
        _onStateChange();
    }

    /**
     *
     * @param data
     * @private
     */
    function _send(data) {
        var outputs = midi.outputs.values();
        for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
            var port = output.value.id;
            var out = midi.outputs.get(port);
            if (out) {
                out.send(data);
            }
        }
    }

    /**
     *
     * @param error
     * @private
     */
    function _onFailure(error) {
        // when we get a failed response, run this code
        console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
    }

    /**
     *
     * @param data
     * @returns {string}
     * @private
     */
    function _dataId(data) {
        return data[0] + '' + data[1];
    }

    /**
     *
     * @param message
     * @private
     */
    function _onMessage(message) {
        data = message.data; // this gives us our [command/channel, note, velocity] data.

        var dataId = _dataId(data);
        if (data[2] == 127) {
            midi_pressed[dataId] = data[2];
            clearTimeout(midi_timeouts[dataId]);
        } else if (midi_pressed[dataId]) {
            delete midi_pressed[dataId];
        }

        if (data[0] == 248) {

            if (clockcounter < 96) {
                clockcounter++;

            } else {
                var clocknow = message.timeStamp;
                var diff = clocknow - clockfirst;
                clockbpm = round(4 * 60 * 1000 / diff, 2);
                HC.log('clockbpm', clockbpm);

                if (!statics.ControlSettings.peak_bpm_detect) { // tempo by MIDI clock
                    if (statics.ControlSettings.tempo != clockbpm) {
                        controller.updateControl('tempo', clockbpm, true, true, false);
                    }
                }

                clockcounter = 0;
                clockfirst = clocknow;
            }
        }

        if (data.length < 2) return;
        // console.log('', data); // MIDI data [144, 63, 73]

        var cmd = data[0];
        var id = data[1];
        var vel = (2 in data ? data[2] : 127);

        if (vel == 126 || vel == 1) { // glow/off
            return;
        }

        var shifts = Object.keys(midi_shifted);

        if (cmd in statics.MidiController) {
            cmd = statics.MidiController[cmd];

            if (id in cmd) {

                id = cmd[id];
                var shift = '';
                var shiftTo = 'default';
                //if (vel) {
                for (var i = 0; i < shifts.length; i++) {
                    if (midi_shifted[shifts[i]]) {
                        shiftTo = shifts[i];
                        shift = midi_shifted[shifts[i]];

                        if (id.default && id.default.shift == shiftTo) {
                            shift = '';
                            shiftTo = 'default';
                        }

                        break;
                    }
                }
                //}
                if (shiftTo in id) {
                    id = id[shiftTo];

                    var settings = id.section + 'Settings';
                    var values = id.section + 'Values';
                    var types = id.section + 'Types';
                    var func = 'update' + id.section;
                    var name = shift + id.name;

                    if (func in instance) {
                        func = instance[func];
                        if (settings in statics) {
                            settings = statics[settings];
                            if (!(name in settings) && id.name in settings) {
                                name = id.name;
                            }

                            _switchType(id, name, vel, settings, values, types, func, message.timeStamp);
                        }
                    }
                } else {
                    HC.log('midi_miss', data);
                }
            } else {
                HC.log('midi_miss', data);
            }
        } else {
            HC.log('midi_miss', data);
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
     * @private
     */
    function _switchType(id, name, vel, settings, values, types, func, timestamp) {

        var last = (values + name) in cache ? cache[values + name] : [0, 0, 0];
        var tdiff = timestamp - last[1];

        if (tdiff < 5) {
            return;
        }

        var blast = false;
        // no acceleration
        //var step = Math.max(63, Math.min(65, vel)) - 64;
        // acceleration up to 3
        //var step = Math.max(60, Math.min(68, vel)) - 64;
        // acceleration up to 4
        //var step = Math.max(59, Math.min(69, vel)) - 64;
        // acceleration up to 5
        var step = Math.max(58, Math.min(70, vel)) - 64;

        if (!id.options) {
            id.options = {};
        }

        // acceleration highlight
        if (Math.abs(step) > 1) {
            id.options.color = 'red';
        } else {
            id.options.color = '';
        }

        var cch = [step, timestamp, blast];
        cache[values + name] = cch;

        switch (id.type) {

            case 'status':
                var status = id.data;
                if (values in statics && status in statics) {
                    values = statics[values];
                    status = statics[status];

                    if (name in values) {
                        values = values[name];
                        var keys = Object.keys(values);
                        for (var i = 0; i < keys.length; i++) {
                            var n = id.name + i;
                            if (id.suffix) {
                                n += id.suffix;
                            }
                            var ass = [data[0], id.start + i];
                            if (vel && n in status && status[n]) {
                                _glow(ass);

                            } else {
                                _off(ass);
                            }
                        }
                    }
                }
                break;

            case 'shift':
                var enable = vel ? id.name : false;
                var wasshifted = midi_shifted[id.shift];
                midi_shifted[id.shift] = enable;
                if (enable) {
                    _showOSD(id.type, id.shift + '/' + enable, false);

                    // search for assignment and send
                    assignment = _findMidiAssignment(id, name, settings, values, types);
                    if (assignment !== false) {
                        _glow(assignment);
                    }

                } else {
                    _hideOSD(id.type);
                    if (wasshifted) {
                        _off(assignment);
                    }
                }

                break;

            case 'select':
                if (values in statics) {
                    values = statics[values];

                    if (name in values) {

                        values = values[name];
                        var keys = Object.keys(values);
                        var min = 0;
                        var max = keys.length - 1;
                        var unit = 1;
                        step = (step) > 0 ? 1 : -1;
                        var cur = settings[name];
                        cur = keys.indexOf('' + cur);
                        //cur = !isNaN(parseInt(cur)) ? parseInt(cur) : keys.indexOf(cur);
                        var next = cur + (step * unit);

                        var value = Math.max(min, Math.min(max, next));

                        value = keys[value];

                        value = !isNaN(parseInt(value)) ? parseInt(value) : value;
                        var display = values[value];

                        func.call(instance, name, value, true, true, false);
                        _showOSD(name, display, OSD_TIMEOUT);
                    }
                }
                break;

            case 'volume':
            case 'step':
                if (types in (statics)) {
                    types = statics[types];
                    if (name in types) {
                        types = types[name];

                        var min = types[0];
                        var max = types[1];
                        var unit = types[2];

                        if (id.options && id.options.unit) {
                            unit = id.options.unit;
                        }

                        var cur = settings[name];
                        var next = next = cur + (step * unit);

                        if (id.type == 'step') {
                            step = step > 0 ? unit : -unit;
                        }

                        var value = Math.max(min, Math.min(max, next));

                        func.call(instance, name, round(value, 3), true, true, false);
                        _showOSD(name, value, OSD_TIMEOUT, id);

                        //data = [step, timestamp, diff];
                    }
                }
                break;

            case 'function':
                if (vel) {
                    func = settings[name];
                    func.call(instance, name, value, true, true, false);
                    _showOSD(name, value, false);

                } else {
                    _hideOSD(name);
                }
                break;

            case 'toggle':
                if (vel || vel === undefined) {
                    var current = settings[name];
                    var value = !current;

                    func.call(instance, name, value, true, true, false);
                    _showOSD(name, value, false);

                } else {
                    _hideOSD(name);
                }
                break;

            case 'boolean':
                if (vel || vel === undefined) {

                    var step = vel - 64;
                    var value = step > -1 ? true : false;
                    func.call(instance, name, value, true, true, false);
                    _showOSD(name, value, OSD_TIMEOUT, id);

                } else {
                    _hideOSD(name);
                }
                break;

            case 'push':
                var value = vel > 0;
                func.call(instance, name, value, true, true, false);
                if (value) {
                    _showOSD(name, value, false);

                } else {
                    _hideOSD(name);
                }
                break;

            case 'assign':
                if (vel) {
                    var value = id.value;

                    func.call(instance, name, value, true, true, false);
                    _showOSD(name, value, false);

                } else {
                    _hideOSD(name);
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
    function _showOSD(name, value, timeout, id) {

        if (id && id.options && id.options.silent) {
            return;
        }

        _osd(name, value, timeout, ((id && id.options && id.options.color) ? id.options.color : false));
    }

    /**
     *
     * @param id
     * @param name
     * @param settings
     * @param values
     * @param types
     * @returns {*}
     * @private
     */
    function _findMidiAssignment(id, name, settings, values, types) {
        var cmd = statics.MidiController;
        for (var m in cmd) {
            m = parseInt(m);
            var sub = cmd[m];
            for (var s in sub) {
                s = parseInt(s);
                var c = sub[s];
                if (id.shift in c) {
                    var sec = c[id.shift];
                    if (sec.type == 'assign') {
                        var n = sec.name;
                        var v = sec.value;
                        var setting = name + n;
                        if (setting in settings) {
                            var sv = settings[setting];
                            if (sv == v) {
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
     * @param data
     * @param conf
     * @private
     */
    function _glow(data, conf) {
        if (midi && data) {

            var key = _dataId(data);
            var pressed = midi_pressed[key];
            var glowing = midi_glow[key];

            if (!pressed && !glowing) {
                //var outputs = midi.outputs.values();
                var noteon = [data[0], data[1], 126];

                if (conf && conf.delay) { // start glowing after delay
                    midi_timeouts[key] = setTimeout(function () {
                        _send(noteon);
                    }, conf.delay);

                } else { // start glowing now
                    _send(noteon);
                }

                if (conf && conf.timeout) { // stop glowing after timeout
                    midi_timeouts[key] = setTimeout(function () {
                        _off([data[0], data[1]], true);
                        if (conf.times) {
                            conf.times--;
                            midi_timeouts[key] = setTimeout(function () {
                                _glow(data, conf)
                            }, conf.timeout);
                        }
                    }, conf.timeout);

                } else { // block
                    clearTimeout(midi_timeouts[key]);
                    midi_glow[key] = true;
                }
            }

        }
    }

    /**
     *
     * @param name
     * @private
     */
    function _hideOSD(name) {
        _osd(name, undefined, 50);
    }

    /**
     *
     * @param data
     * @param keep
     * @private
     */
    function _off(data, keep) {
        if (midi && data) {
            // var outputs = midi.outputs.values();
            var noteoff = [data[0], data[1], 1];

            _send(noteoff);

            if (!keep) {
                var key = data[0] + '' + data[1];
                midi_glow[key] = false;
            }
        }
    }

    /**
     *
     * @param data
     * @param conf
     * @private
     */
    function _updateBeatClock(data, conf) {
        if (midi && data) {
            var to = conf.duration / 24;
            for (var i = 0; i < 24; i++) {
                setTimeout(function () {
                    var clock = [data[0], data[1]];

                    _send(clock);

                }, to * i);
            }
        }
    }

    /**
     *
     * @param channel
     * @param fixture
     * @param port
     * @param color
     * @param brightness
     * @private
     */
    function _dmx(channel, fixture, port, color, brightness) {
        _send([channel, fixture + port, 127]);
    }

    /**
     *
     */
    return {
        dmx: function (channel, fixture, port, color, brightness) {
            _dmx(channel, fixture, port, color, brightness);
        },

        glow: function (id, conf) {
            _glow(id, conf);
        },

        off: function (id) {
            _off(id);
        },

        clock: function (id, conf) {
            _updateBeatClock(id, conf);
        }
    }
};