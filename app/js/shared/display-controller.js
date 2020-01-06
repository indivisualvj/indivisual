/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.DisplayController = HC.DisplayController || {};

{
    /**
     *
     * @type {HC.DisplayController._general}
     *
     */
    HC.DisplayController._general = class _general extends HC.StaticControlSet {

        static index = 10;

        parent=  'g_video';
        // static _name = 'session';

        settings = {
            fps: 60,
            resolution: '1280x720',
            fov: 1,
            brightness: 1.00,
            transparency: 1.0,
            smearing: 0.0,
            background: '#000000',
            mask_copy: function () {
                let updates = {};
                for (let i = 1; i < statics.DisplayValues.display.length; i++) {
                    let v = 'display' + i + '_visible';
                    if (this.settings[v]) {
                        let okey = 'display0_mask';
                        let key = new RegExp('^display' + i + '_mask');
                        for (let c in this.settings) {
                            if (c.match(key)) {
                                let oc = c.replace(key, okey);
                                updates[c] = this.settings[oc];
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
                    for (let c in this.settings) {
                        if (c.match(key)) {
                            updates[c] = this.settings[c];
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
                    if (this.settings[v]) {
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
                    if (this.settings[v]) {
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
                    if (this.settings[v]) {
                        let _key = (key + '_' + 3);
                        let data = {};
                        data[_key] = 3;
                        messaging.emitDisplays(data, true, true, false);
                    }
                }
            }
        };

        types = {
            fps: [1, 60, 1],
            fov: [0.001, 2, 0.001],
            brightness: [0, 1, 0.02],
            transparency: [0, 1, 0.02],
            smearing: [0, 0.96, 0.02]
        };

        styles = {
            resolution: ['half', 'clear'],
            fov: ['half'],
            brightness: ['half', 'clear'],
            transparency: ['half'],
            smearing: ['half', 'clear'],
            background: ['half'],

            mask_copy: ['quarter'],
            full: ['eight'],
            half: ['eight'],
            third: ['eight'],
            auto: ['eight']
        };
    }
}

{
    /**
     *
     * @type {HC.DisplayController.g_video}
     */
    HC.DisplayController._perspective = class _perspective extends HC.StaticControlSet {

        static index = 10;
        // static _name = 'session';

        parent = 'g_video';

        settings = {
            perspective0_zoom: 1.0,
            perspective0_fov: 1,
            perspective0_angle: 0,
            perspective1_zoom: 1.0,
            perspective1_fov: 1,
            perspective1_angle: 0,
            perspective2_zoom: 1.0,
            perspective2_fov: 1,
            perspective2_angle: 0
        };

        types = {
            perspective0_zoom: [0.01, 5, 0.01],
            perspective0_fov: [0.01, 5, 0.01],
            perspective0_angle: [-180, 180, 0.1],
            perspective1_zoom: [0.01, 5, 0.01],
            perspective1_fov: [0.01, 5, 0.01],
            perspective1_angle: [-180, 180, 0.1],
            perspective2_zoom: [0.01, 5, 0.01],
            perspective2_fov: [0.01, 5, 0.01],
            perspective2_angle: [-180, 180, 0.1]
        };

        styles = {
            perspective0_fov: ['half', 'clear'],
            perspective0_angle: ['half'],
            perspective1_fov: ['half', 'clear'],
            perspective1_angle: ['half'],
            perspective2_fov: ['half', 'clear'],
            perspective2_angle: ['half']
        };
    }
}

// {
//     /**
//      *
//      * @type {HC.DisplayController.g_displays}
//      */
//     HC.DisplayController.g_displays = class g_displays extends HC.StaticControlSet {
//
//         static index = 20;
//         // static _name = 'controls';
//
//         constructor(name) {
//             super(name);
//
//             this.createSettings();
//             this.createMappingSettings();
//         }
//
//         settings = {
//             _general: {
//                 display_visibility: 'visible',
//                 display_speed: 'quarter',
//                 border: 0,
//                 border_mode: 'parent',
//                 border_color: '#ffffff',
//                 border_speed: 'half',
//                 trigger_display_visibility: function () {
//                     controller.updateDisplay('trigger_display_visibility', true, true, true, false);
//                 },
//                 force_display_visibility: function () {
//                     controller.updateDisplay('force_display_visibility', true, true, true, false);
//                 },
//                 reset_display_visibility: function () {
//                     controller.updateDisplay('reset_display_visibility', true, true, true, false);
//                 }
//             }
//         };
//
//         types = {
//             display_zindex: [0, 18, 1],
//             display_smearing: [0, 0.96, 0.02],
//         };
//
//         styles = {
//
//         };
//
//         values = {
//             display_visibility: 'visible',
//             display_speed: 'quarter',
//             display_visible: false,
//             display_mapping: '',
//             display_static: false,
//             display_noborder: false,
//             display_transparent: false,
//             display_video: 0,
//             display_smearing: 0.0,
//             display_zindex: 0,
//             display_mask_shape: 'off',
//             display_keepbounds: true,
//             display_mask: ''
//         };
//
//         /**
//          *
//          */
//         createSettings() {
//             let okey = 'display';
//             for (let i = 0; i < statics.DisplayValues.display.length; i++) {
//
//                 let key = 'display' + i;
//                 let ukey = '_' + key;
//
//                 this.settings[ukey] = {};
//
//                 // settings
//                 this.settings[ukey][key + '_static'] = this.values[okey + '_static'];
//                 this.settings[ukey][key + '_transparent'] = this.values[okey + '_transparent'];
//                 this.settings[ukey][key + '_noborder'] = this.values[okey + '_noborder'];
//                 this.settings[ukey][key + '_video'] = this.values[okey + '_video'];
//                 this.settings[ukey][key + '_smearing'] = this.values[okey + '_smearing'];
//
//                 // types
//                 this.types[key + '_zindex'] = this.types[okey + '_zindex'];
//                 this.types[key + '_smearing'] = this.types[okey + '_smearing'];
//
//                 // values
//                 this.values[key + '_video'] = statics.DisplayValues.video;
//
//                 // styles
//                 this.styles[key + '_static'] = ['quarter'];
//                 this.styles[key + '_transparent'] = ['quarter'];
//                 this.styles[key + '_noborder'] = ['quarter'];
//                 this.styles[key + '_video'] = ['half'];
//                 this.styles[key + '_smearing'] = ['half'];
//
//             }
//         }
//
//         /**
//          *
//          * @return {*}
//          */
//         createMappingSettings() {
//             let okey = 'display';
//             for (let i = 0; i < statics.DisplayValues.display.length; i++) {
//
//                 let key = 'display' + i;
//                 let ukey = '_' + key;
//
//                 // values
//                 this.values[key + '_mask_shape'] = statics.DisplayValues['masking_shape'];
//
//                 // styles
//                 this.styles[key + '_visible'] = ['quarter', 'clear'];
//                 this.styles[key + '_keepbounds'] = ['quarter'];
//                 this.styles[key + '_1'] = ['eight'];
//                 this.styles[key + '_2'] = ['eight'];
//                 this.styles[key + '_3'] = ['eight'];
//                 this.styles[key + '_4'] = ['eight'];
//                 this.styles[key + '_zindex'] = ['half', 'clear'];
//                 this.styles[key + '_mapping'] = ['half'];
//                 this.styles[key + '_mask_shape'] = ['half', 'clear'];
//                 this.styles[key + '_mask'] = ['half'];
//
//                 // settings
//                 let _resize = function (key, factor) {
//                     return function () {
//                         let _key = (key + '_' + factor);
//                         let data = {};
//                         data[_key] = factor;
//                         messaging.emitDisplays(data, true, true, false);
//                     };
//                 };
//
//                 this.settings[ukey] = {};
//                 this.settings[ukey][key + '_visible'] = this.values[okey + '_visible'];
//                 this.settings[ukey][key + '_keepbounds'] = this.values[okey + '_keepbounds'];
//                 this.settings[ukey][key + '_1'] = _resize(key, 1);
//                 this.settings[ukey][key + '_2'] = _resize(key, 2);
//                 this.settings[ukey][key + '_3'] = _resize(key, 3);
//                 this.settings[ukey][key + '_4'] = _resize(key, 4);
//                 this.settings[ukey][key + '_zindex'] = i + 1;
//                 this.settings[ukey][key + '_mapping'] = this.values[okey + '_mapping'];
//                 this.settings[ukey][key + '_mask_shape'] = this.values[okey + '_mask_shape'];
//                 this.settings[ukey][key + '_mask'] = this.values[okey + '_mask'];
//             }
//         }
//     }
// }

{
    /**
     *
     * @type {HC.DisplayControllerUi}
     */
    HC.DisplayControllerUi = class DisplayControllerUi extends HC.ControlSetGuifyUi {
        /**
         *
         * @param value
         */
        onChange(value) {
            controller.updateDisplay(this.property, value, true, true, false);
        }
    }
}