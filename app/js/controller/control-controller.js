/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {

    /**
     *
     * @constructor
     */
    HC.ControlController = function () {

        this.g_session = {
            session: statics.ControlSettings.session,
            // ses_saveas: function () {
            //     alert('nope...');
            // },
            // ses_delete: function () {
            //     alert('nope...');
            // }
        };

        this.g_controls = {
            play: statics.ControlSettings.play,

            reset: function () {

                if (statics.ctrlKey) {
                    var yes = confirm('Reset everything?');
                    if (yes) {
                        var os = statics.ControlSettings.session;
                        statics.ControlSettings.update(statics.ControlSettings.initial);
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

            monitor: statics.ControlSettings.monitor,
            push_layers: function () {
                controller.syncLayers();
            },
            push_sources: function () {
                controller.pushSources();
            },
            rst_shaders: function () {
                // todo CS
                controller.shaders('default', statics.AnimationSettings.initial, true);
            },
            debug: statics.ControlSettings.debug,
            tempo: statics.ControlSettings.tempo,
            beat: statics.ControlSettings.beat,
            audio: statics.ControlSettings.audio,
            peak_bpm_detect: statics.ControlSettings.peak_bpm_detect,
            layer: statics.ControlSettings.layer,

            shuffleable: statics.ControlSettings.shuffleable,
            shuffle_mode: statics.ControlSettings.shuffle_mode,
            shuffle_every: statics.ControlSettings.shuffle_every,

            open: true
        };
    }
})();
