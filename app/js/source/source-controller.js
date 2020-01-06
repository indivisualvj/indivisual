/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {

    /**
     *
     * @constructor
     */
    HC.SourceController = function () {

        var sources = {
            group0: statics.SourceSettings.group0,
            group1: statics.SourceSettings.group1,
            g0animation: function () {
                controller.setAllDisplaysTo('source', 'animation', 'group0');
            },
            g0sequence: function () {
                controller.setAllDisplaysTo('source', 'sequence', 'group0');
            },
            g0perspective: function () {
                controller.setAllDisplaysTo('source', 'perspective', 'group0');
            },
            g0black: function () {
                controller.setAllDisplaysTo('source', 'black', 'group0');
            },
            g0offline: function () {
                controller.setAllDisplaysTo('source', 'offline', 'group0');
            },
            g1animation: function () {
                controller.setAllDisplaysTo('source', 'animation', 'group1');
            },
            g1sequence: function () {
                controller.setAllDisplaysTo('source', 'sequence', 'group1');
            },
            g1perspective: function () {
                controller.setAllDisplaysTo('source', 'perspective', 'group1');
            },
            g1black: function () {
                controller.setAllDisplaysTo('source', 'black', 'group1');
            },
            g1offline: function () {
                controller.setAllDisplaysTo('source', 'offline', 'group1');
            }
        };
        sources = HC.SourceController.createSourceControls(sources);

        sources.seq_0 = function () {
            controller.setAllDisplaysTo('sequence', 0);
        };
        sources.seq_1 = function () {
            controller.setAllDisplaysTo('sequence', 1);
        };
        sources.seq_2 = function () {
            controller.setAllDisplaysTo('sequence', 2);
        };
        sources.seq_3 = function () {
            controller.setAllDisplaysTo('sequence', 3);
        };
        sources.seq_4 = function () {
            controller.setAllDisplaysTo('sequence', 4);
        };
        sources.seq_inc = function () {
            controller.setAllDisplaysTo('sequence', false);
        };

        sources.material_map = statics.SourceSettings.material_map;

        var lighting = {
            lighting_type: statics.SourceValues.lighting_type,
            lighting_speed: statics.SourceValues.lighting_speed,
            lighting_color: statics.SourceValues.lighting_color,
            lighting_pattern_lights: statics.SourceSettings.lighting_pattern_lights,
            lighting_scale: statics.SourceSettings.lighting_scale,
            lighting_brightness: statics.SourceSettings.lighting_brightness
        };

        this.g_lighting = lighting;

        this.g_sources = sources;

        var sequence = {};

        sequence = HC.SourceController.createSequenceControls(sequence);

        var _reset = function (seq) {
            var key = getSequenceKey(seq);
            sequence[key + '_reset'] = function () {
                var updates = {};
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

                var endKey = getSequenceEndKey(seq);
                if (endKey in statics.SourceTypes) {
                    var type = statics.SourceTypes[endKey];
                    var length = type[1];
                    updates[endKey] = length;
                }

                controller.updateSources(updates, true, false, false);
                messaging.emitSources(updates, true, true, false);
            };
        };

        _reset(0);
        _reset(1);
        _reset(2);
        _reset(3);
        _reset(4);

        var _rereset = function (seq) {
            var key = getSequenceKey(seq);
            sequence[key + '_rereset'] = function () {
                var updates = {};
                updates[key + '_overlay'] = statics.SourceSettings.initial[key + '_overlay'];
                updates[key + '_input'] = statics.SourceSettings.initial[key + '_input'];
                updates[key + '_blendmode'] = statics.SourceSettings.initial[key + '_blendmode'];
                updates[key + '_osci'] = statics.SourceSettings.initial[key + '_osci'];

                controller.updateSources(updates, true, false, false);
                messaging.emitSources(updates, true, true, false);
            };
        };

        _rereset(0);
        _rereset(1);
        _rereset(2);
        _rereset(3);
        _rereset(4);

        this.g_sequences = sequence;

        var sample = HC.SourceController.createSampleControls();

        this.g_samples = sample;
    };

    /**
     *
     * @returns {{}}
     */
    HC.SourceController.createSampleControls = function () {
        var controls = {};
        for (var i in statics.SourceValues.sample) {
            var beatKey = getSampleBeatKey(i);

            statics.SourceValues[beatKey] = statics.SourceValues.beats;

            controls[getSampleEnabledKey(i)] = false;
            controls[getSampleRecordKey(i)] = false;
            controls[beatKey] = 8;
        }

        return controls;
    };

    /**
     *
     * @param controls
     * @returns {*}
     */
    HC.SourceController.createSequenceControls = function (controls) {
        for (var i in statics.SourceValues.sequence) {
            var n = 'sequence' + i;
            statics.SourceValues[n + '_input'] = statics.SourceValues.input;
            statics.SourceValues[n + '_overlay'] = statics.SourceValues.overlay;
            statics.SourceValues[n + '_blendmode'] = statics.SourceValues.blendmode;
            statics.SourceValues[n + '_osci'] = statics.SourceValues.oscillator;

            controls[n + '_input'] = statics.SourceSettings[n + '_input'];
            controls[n + '_overlay'] = statics.SourceSettings[n + '_overlay'];
            controls[n + '_brightness'] = statics.SourceSettings[n + '_brightness'];
            controls[n + '_blendmode'] = statics.SourceSettings[n + '_blendmode'];
        }

        return controls;
    };

    /**
     *
     * @param mapping
     * @returns {*}
     */
    HC.SourceController.createSourceControls = function (mapping) {
        var okey = 'display';
        for (var i = 0; i < statics.DisplayValues.display.length; i++) {

            var key = 'display' + i;
            //var ukey = '_' + key;
            if (!(key in statics.SourceSettings)) {

                statics.SourceSettings[key + '_source'] = statics.SourceSettings[okey + '_source'];
                statics.SourceSettings[key + '_sequence'] = statics.SourceSettings[okey + '_sequence'];

                // initial

                statics.SourceSettings.initial[key + '_source'] = statics.SourceSettings.initial[okey + '_source'];
                statics.SourceSettings.initial[key + '_sequence'] = statics.SourceSettings.initial[okey + '_sequence'];
                statics.SourceValues[key + '_source'] = statics.SourceValues['source'];
                statics.SourceValues[key + '_sequence'] = statics.SourceValues['sequence'];

                // type

                statics.SourceTypes[key + '_source'] = statics.SourceTypes[okey + '_source'];
                statics.SourceTypes[key + '_sequence'] = statics.SourceTypes[okey + '_sequence'];
            }

            mapping[key + '_source'] = statics.SourceSettings[key + '_source'];
            mapping[key + '_sequence'] = statics.SourceSettings[key + '_sequence'];

        }

        return mapping;
    };

    /**
     *
     */
    HC.SourceController.createAllControls = function () {
        HC.SourceController.createSampleControls();
        HC.SourceController.createSequenceControls({});
        HC.SourceController.createSourceControls({});
    };

})();