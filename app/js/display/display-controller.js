/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.DisplayController}
     */
    HC._DisplayController = class DisplayController {

        /**
         *
         */
        constructor() {
            let video = {
                _general: {
                    fps: statics.DisplaySettings.fps,
                    resolution: statics.DisplaySettings.resolution,
                    fov: statics.DisplaySettings.fov,
                    brightness: statics.DisplaySettings.brightness,
                    transparency: statics.DisplaySettings.transparency,
                    smearing: statics.DisplaySettings.smearing,
                    background: statics.DisplaySettings.background,
                    // clip_context: statics.DisplaySettings.clip_context,
                    mask_copy: function () {
                        let updates = {};
                        for (let i = 1; i < statics.DisplayValues.display.length; i++) {
                            let v = 'display' + i + '_visible';
                            if (statics.DisplaySettings[v]) {
                                let okey = 'display0_mask';
                                let key = new RegExp('^display' + i + '_mask');
                                for (let c in statics.DisplaySettings) {
                                    if (c.match(key)) {
                                        let oc = c.replace(key, okey);
                                        updates[c] = statics.DisplaySettings[oc];
                                    }
                                }
                            }
                        }
                        controller.updateDisplays(updates, true, true, true);
                        messaging.emitDisplays(updates, true, false, true);
                    },
                    mask_reset: function () {
                        let updates = {};
                        for (let i = 0; i < statics.DisplayValues.display.length; i++) {
                            let key = new RegExp('^display' + i + '_mask');
                            for (let c in statics.DisplaySettings.initial) {
                                if (c.match(key)) {
                                    updates[c] = statics.DisplaySettings.initial[c];
                                }
                            }
                        }
                        controller.updateDisplays(updates, true, true, true);
                        messaging.emitDisplays(updates, true, false, true);
                    },
                    auto: function () {
                        for (let i = 0; i < statics.DisplayValues.display.length; i++) {
                            let key = 'display' + i;
                            let _key = key + '_mapping';
                            let data = {};
                            data[_key] = '';
                            messaging.emitDisplays(data, true, true, false);
                        }
                    },
                    full: function () {
                        for (let i = 0; i < statics.DisplayValues.display.length; i++) {
                            let key = 'display' + i;
                            let v = key + '_visible';
                            if (statics.DisplaySettings[v]) {
                                let _key = (key + '_' + 1);
                                let data = {};
                                data[_key] = 1;
                                messaging.emitDisplays(data, true, true, false);
                            }
                        }
                    },
                    half: function () {
                        for (let i = 0; i < statics.DisplayValues.display.length; i++) {
                            let key = 'display' + i;
                            let v = key + '_visible';
                            if (statics.DisplaySettings[v]) {
                                let _key = (key + '_' + 2);
                                let data = {};
                                data[_key] = 2;
                                messaging.emitDisplays(data, true, true, false);
                            }
                        }
                    },
                    third: function () {
                        for (let i = 0; i < statics.DisplayValues.display.length; i++) {
                            let key = 'display' + i;
                            let v = key + '_visible';
                            if (statics.DisplaySettings[v]) {
                                let _key = (key + '_' + 3);
                                let data = {};
                                data[_key] = 3;
                                messaging.emitDisplays(data, true, true, false);
                            }
                        }
                    }
                },
                _perspective: {
                    perspective0_zoom: statics.DisplaySettings.perspective0_zoom,
                    perspective0_fov: statics.DisplaySettings.perspective0_fov,
                    perspective0_angle: statics.DisplaySettings.perspective0_angle,
                    perspective1_zoom: statics.DisplaySettings.perspective1_zoom,
                    perspective1_fov: statics.DisplaySettings.perspective1_fov,
                    perspective1_angle: statics.DisplaySettings.perspective1_angle,
                    perspective2_zoom: statics.DisplaySettings.perspective2_zoom,
                    perspective2_fov: statics.DisplaySettings.perspective2_fov,
                    perspective2_angle: statics.DisplaySettings.perspective2_angle
                }
            };
            this.g_video = HC.DisplayController.createMappingControls(video);

            let display = {
                _general: {
                    display_visibility: statics.DisplaySettings.display_visibility,
                    display_speed: statics.DisplaySettings.display_speed,
                    border: statics.DisplaySettings.border,
                    border_color: statics.DisplaySettings.border_color,
                    border_mode: statics.DisplaySettings.border_mode,
                    border_speed: statics.DisplaySettings.border_speed,
                    trigger_display_visibility: function () {
                        controller.updateDisplay('trigger_display_visibility', true, true, true, false);
                    },
                    force_display_visibility: function () {
                        controller.updateDisplay('force_display_visibility', true, true, true, false);
                    },
                    reset_display_visibility: function () {
                        controller.updateDisplay('reset_display_visibility', true, true, true, false);
                    }

                }
            };
            this.g_displays = HC.DisplayController.createControls(display);
        }

        /**
         *
         * @param mapping
         * @returns {*}
         */
        static createMappingControls(mapping) {
            let okey = 'display';
            for (let i = 0; i < statics.DisplayValues.display.length; i++) {

                let key = 'display' + i;
                let ukey = '_' + key;
                if (!(key in statics.DisplaySettings)) {
                    statics.DisplaySettings[key + '_visible'] = statics.DisplaySettings[okey + '_visible'];
                    statics.DisplaySettings[key + '_mapping'] = statics.DisplaySettings[okey + '_mapping'];
                    statics.DisplaySettings[key + '_zindex'] = i + 1;

                    statics.DisplaySettings[key + '_mask_shape'] = statics.DisplaySettings[okey + '_mask_shape'];
                    statics.DisplaySettings[key + '_keepbounds'] = statics.DisplaySettings[okey + '_keepbounds'];
                    statics.DisplaySettings[key + '_mask'] = statics.DisplaySettings[okey + '_mask'];

                    // initial
                    statics.DisplaySettings.initial[key + '_visible'] = statics.DisplaySettings.initial[okey + '_visible'];
                    statics.DisplaySettings.initial[key + '_mapping'] = statics.DisplaySettings.initial[okey + '_mapping'];
                    statics.DisplaySettings.initial[key + '_zindex'] = i + 1;//statics.DisplaySettings.initial[okey + '_zindex'];
                    statics.DisplaySettings.initial[key + '_mask_shape'] = statics.DisplaySettings.initial[okey + '_mask_shape'];
                    statics.DisplaySettings.initial[key + '_keepbounds'] = statics.DisplaySettings.initial[okey + '_keepbounds'];
                    statics.DisplaySettings.initial[key + '_mask'] = statics.DisplaySettings.initial[okey + '_mask'];
                    statics.DisplaySettings.initial[key + '_1'] = 1;
                    statics.DisplaySettings.initial[key + '_2'] = 2;
                    statics.DisplaySettings.initial[key + '_3'] = 3;
                    statics.DisplaySettings.initial[key + '_4'] = 4;

                    statics.DisplayValues[key + '_mask_shape'] = statics.DisplayValues['masking_shape'];

                    // type
                    statics.DisplayTypes[key + '_visible'] = ['quarter'];
                    statics.DisplayTypes[key + '_zindex'] = statics.DisplayTypes[okey + '_zindex'];
                    statics.DisplayTypes[key + '_mask_shape'] = ['half'];
                    statics.DisplayTypes[key + '_keepbounds'] = ['quarter'];
                    statics.DisplayTypes[key + '_mapping'] = ['half'];
                    statics.DisplayTypes[key + '_mask'] = ['half'];
                    statics.DisplayTypes[key + '_1'] = ['eight'];
                    statics.DisplayTypes[key + '_2'] = ['eight'];
                    statics.DisplayTypes[key + '_3'] = ['eight'];
                    statics.DisplayTypes[key + '_4'] = ['eight'];
                }

                let _resize = function (key, factor) {
                    return function () {
                        let _key = (key + '_' + factor);
                        let data = {};
                        data[_key] = factor;
                        messaging.emitDisplays(data, true, true, false);
                    };
                };

                mapping[ukey] = {};
                mapping[ukey][key + '_visible'] = statics.DisplaySettings[key + '_visible'];
                mapping[ukey][key + '_keepbounds'] = statics.DisplaySettings[key + '_keepbounds'];
                mapping[ukey][key + '_1'] = _resize(key, 1);
                mapping[ukey][key + '_2'] = _resize(key, 2);
                mapping[ukey][key + '_3'] = _resize(key, 3);
                mapping[ukey][key + '_4'] = _resize(key, 4);
                mapping[ukey][key + '_zindex'] = statics.DisplaySettings[key + '_zindex'];
                mapping[ukey][key + '_mapping'] = statics.DisplaySettings[key + '_mapping'];
                mapping[ukey][key + '_mask_shape'] = statics.DisplaySettings[key + '_mask_shape'];
                mapping[ukey][key + '_mask'] = statics.DisplaySettings[key + '_mask'];
            }

            return mapping;
        }

        /**
         *
         * @param mapping
         * @returns {*}
         */
        static createControls(mapping) {
            let okey = 'display';
            for (let i = 0; i < statics.DisplayValues.display.length; i++) {

                let key = 'display' + i;
                let ukey = '_' + key;
                if (!(key in statics.DisplaySettings)) {

                    statics.DisplaySettings[key + '_static'] = statics.DisplaySettings[okey + '_static'];
                    statics.DisplaySettings[key + '_transparent'] = statics.DisplaySettings[okey + '_transparent'];
                    statics.DisplaySettings[key + '_noborder'] = statics.DisplaySettings[okey + '_noborder'];
                    statics.DisplaySettings[key + '_video'] = statics.DisplaySettings[okey + '_video'];
                    statics.DisplaySettings[key + '_smearing'] = statics.DisplaySettings[okey + '_smearing'];

                    // initial

                    statics.DisplaySettings.initial[key + '_static'] = statics.DisplaySettings.initial[okey + '_static'];
                    statics.DisplaySettings.initial[key + '_noborder'] = statics.DisplaySettings.initial[okey + '_noborder'];
                    statics.DisplaySettings.initial[key + '_transparent'] = statics.DisplaySettings.initial[okey + '_transparent'];
                    statics.DisplaySettings.initial[key + '_smearing'] = statics.DisplaySettings.initial[okey + '_smearing'];
                    statics.DisplaySettings.initial[key + '_video'] = statics.DisplaySettings.initial[okey + '_video'];
                    statics.DisplayValues[key + '_video'] = statics.DisplayValues.video;

                    // type

                    statics.DisplayTypes[key + '_static'] = ['quarter'];
                    statics.DisplayTypes[key + '_noborder'] = ['quarter'];
                    statics.DisplayTypes[key + '_transparent'] = ['quarter'];
                    statics.DisplayTypes[key + '_video'] = ['half'];
                    statics.DisplayTypes[key + '_smearing'] = statics.DisplayTypes[okey + '_smearing'];
                }

                mapping[ukey] = {};

                mapping[ukey][key + '_static'] = statics.DisplaySettings[key + '_static'];
                mapping[ukey][key + '_transparent'] = statics.DisplaySettings[key + '_transparent'];
                mapping[ukey][key + '_noborder'] = statics.DisplaySettings[key + '_noborder'];
                mapping[ukey][key + '_video'] = statics.DisplaySettings[key + '_video'];
                mapping[ukey][key + '_smearing'] = statics.DisplaySettings[key + '_smearing'];

            }

            return mapping;
        }

        /**
         *
         */
        static createAllControls() {
            HC.DisplayController.createMappingControls({});
            HC.DisplayController.createControls({});
        }
    }
}
