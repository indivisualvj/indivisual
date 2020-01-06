/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.DisplayController = HC.DisplayController || {};

{
    /**
     * 
     * @type {HC.DisplayController.g_video}
     */
    HC.DisplayController.g_video = class g_session extends HC.StaticControlSet {

        static index = 10;
        // static _name = 'session';

        settings = {
            _general: {
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
            background: ['half']
        };
    }
}

{
    /**
     *
     * @type {HC.DisplayController.g_controls}
     */
    HC.DisplayController.g_displays = class g_controls extends HC.StaticControlSet {

        static index = 20;
        // static _name = 'controls';

        constructor(name) {
            super(name);

            this.createSettings();
            this.createMappingSettings();
        }

        settings = {
            _general: {
                display_visibility: 'visible',
                display_speed: 'quarter',
                border: 0,
                border_mode: 'parent',
                border_color: '#ffffff',
                border_speed: 'half',
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

        types = {
            display_zindex: [0, 18, 1],
            display_smearing: [0, 0.96, 0.02],
        };

        styles = {

        };

        values = {
            display_static: false,
            display_noborder: false,
            display_transparent: false,
            display_video: 0,
            display_smearing: 0.0
        };

        /**
         * 
         */
        createSettings() {

        }

        /**
         *
         * @return {*}
         */
        createMappingSettings() {

        }
    }
}

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