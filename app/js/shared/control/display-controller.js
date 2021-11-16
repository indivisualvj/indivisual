/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.DisplayController = HC.DisplayController || {};

{
    HC.DisplayController.video = {};

    /**
     *
     * @type {HC.DisplayController.video._general}
     */
    HC.DisplayController.video._general = class _general extends HC.ControlSet {

        static index = 10;

        settings = {
            fps: 60,
            resolution: '1280x720',
            fov: 1,
            brightness: 1.00,
            transparency: 1.0,
            smearing: 0.0,
            background: '#000000',
            mask_copy: () => {
                let updates = {};
                for (let i = 1; i < this.config.DisplayValues.display.length; i++) {
                    let v = 'display' + i + '_visible';
                    if (this.config.DisplaySettings[v]) {
                        let okey = 'display0_mask';
                        let key = 'display' + i + '_mask';

                        updates[key] = this.config.DisplaySettings[okey];
                    }
                }
                this.config.messaging.program.updateDisplays(updates, true, true, true);
                this.config.emitDisplays(updates, true, false, true);
            },
            mask_reset: () => {
                let updates = {};
                for (let i = 0; i < this.config.DisplayValues.display.length; i++) {
                    let key = 'display' + i;
                    let v = key + '_visible';
                    key +=  '_mask';
                    if (this.config.DisplaySettings[v]) {
                        updates[key] = this.config.DisplaySettingsManager.get('video.displayN').getDefault(key);
                    }
                }
                this.config.messaging.program.updateDisplays(updates, true, true, true);
                this.config.emitDisplays(updates, true, false, true);
            },
            auto: () => {
                for (let i = 0; i < this.config.DisplayValues.display.length; i++) {
                    let key = 'display' + i;
                    key += '_mapping';
                    let data = {};
                    data[key] = '';
                    this.config.emitDisplays(data, true, true, false);
                }
            },
            full: () => {
                for (let i = 0; i < this.config.DisplayValues.display.length; i++) {
                    let key = 'display' + i;
                    let v = key + '_visible';
                    if (this.config.DisplaySettings[v]) {
                        key += '_' + 1;
                        let data = {};
                        data[key] = 1;
                        this.config.emitDisplays(data, true, true, false);
                    }
                }
            },
            half: () => {
                for (let i = 0; i < this.config.DisplayValues.display.length; i++) {
                    let key = 'display' + i;
                    let v = key + '_visible';
                    if (this.config.DisplaySettings[v]) {
                        key += '_' + 2;
                        let data = {};
                        data[key] = 2;
                        this.config.emitDisplays(data, true, true, false);
                    }
                }
            },
            third: () => {
                for (let i = 0; i < this.config.DisplayValues.display.length; i++) {
                    let key = 'display' + i;
                    let v = key + '_visible';
                    if (this.config.DisplaySettings[v]) {
                        key += '_' + 3;
                        let data = {};
                        data[key] = 3;
                        this.config.emitDisplays(data, true, true, false);
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

            mask_copy: ['quarter', 'clear'],
            mask_reset: ['quarter'],
            full: ['eight'],
            half: ['eight'],
            third: ['eight'],
            auto: ['eight']
        };

    };

    /**
     *
     * @type {HC.DisplayController.video._perspective}
     * @private
     */
    HC.DisplayController.video._perspective = class _perspective extends HC.ControlSet {

        static index = 10;

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
    };

    /**
     *
     * @type {HC.DisplayController.video.displayN}
     */
    HC.DisplayController.video.displayN = class displayN extends HC.IterableControlSet {

        static index = 10;
        prefix = 'display';

        settings = {
            display_visible: false,
            display_keepbounds: true,
            display_1: 1,
            display_2: 2,
            display_3: 3,
            display_4: 4,
            display_zindex: 0,
            display_mapping: '',
            display_mask_shape: 'off',
            display_mask: ''
        };

        types = {
            display_zindex: [0, 18, 1],
        };

        styles = {
            display_visible: ['quarter', 'clear'],
            display_keepbounds: ['quarter'],
            display_1: ['eight'],
            display_2: ['eight'],
            display_3: ['eight'],
            display_4: ['eight'],
            display_zindex: ['half', 'clear'],
            display_mapping: ['half'],
            display_mask_shape: ['half', 'clear'],
            display_mask: ['half']
        };

        values = {
            display_mask_shape: 0
        };

        parents = {
            display_visible: '',
            display_keepbounds: '',
            display_1: '',
            display_2: '',
            display_3: '',
            display_4: '',
            display_zindex: '',
            display_mapping: '',
            display_mask_shape: '',
            display_mask: ''
        };

        /**
         *
         * @param pluggedValues
         */
        createSettings(pluggedValues) {

            for (let member in this.members) {
                this[member] = {};
            }

            for (let i = 0; i < pluggedValues[this.prefix].length; i++) {
                this._create('settings', i, this.members.settings);
                this._create('types', i, this.members.types);
                this._create('styles', i, this.members.styles);
                this._create('values', i, this.members.values, pluggedValues.display_mask_shape);
                this._create('parents', i, this.members.parents, this.prefix + i);

                // settings
                let _resize = (key, factor) => {
                    return () => {
                        let _key = (key + '_' + factor);
                        let data = {};
                        data[_key] = factor;
                        this.config.messaging.emitDisplays(data, true, true, false);
                    };
                };

                let key = this.prefix + i;
                this.settings[key + '_1'] = _resize(key, 1);
                this.settings[key + '_2'] = _resize(key, 2);
                this.settings[key + '_3'] = _resize(key, 3);
                this.settings[key + '_4'] = _resize(key, 4);
            }
        }

    };
}

{
    HC.DisplayController.displays = {};

    /**
     *
     * @type {HC.DisplayController.displays._general}
     */
    HC.DisplayController.displays._general = class _general extends HC.ControlSet {

        static index = 20;

        settings = {
            display_visibility: 'visible', // todo: visiblity_mode or display_visibility?
            display_speed: 'quarter',
            border_mode: 'visible',
            border_speed: 'half',
            border: 0,
            border_color: '#ffffff',
        };

        types = {
            display_smearing: [0, 0.96, 0.02],
            border: [0, 128, .5]
        };

        styles = {
            display_visibility: ['half', 'clear'],
            display_speed: ['half'],
            border_mode: ['half', 'clear'],
            border_speed: ['half'],
            border: ['half', 'clear'],
            border_color: ['half'],
        };

        values = {
            display_static: false,
            display_noborder: false,
            display_transparent: false,
            display_smearing: 0.0
        };

    };

    /**
     *
     * @type {HC.DisplayController.displays.displayN}
     */
    HC.DisplayController.displays.displayN = class displayN extends HC.IterableControlSet {

        static index = 20;

        prefix = 'display';

        settings = {
            display_static: false,
            display_transparent: false,
            display_noborder: false,
            display_smearing: 0.0
        };

        types = {
            display_smearing: [0, 0.96, 0.02],
        };

        styles = {
            display_static: ['quarter', 'clear'],
            display_transparent: ['quarter'],
            display_noborder: ['quarter'],
            // display_smearing: ['full']
        };

        values = {
        };

        parents = {
            display_static: '',
            display_noborder: '',
            display_transparent: '',
            display_smearing: ''
        };

        createSettings(pluggedValues) {
            for (let member in this.members) {
                this[member] = {};
            }

            for (let i = 0; i < pluggedValues[this.prefix].length; i++) {
                this._create('settings', i, this.members.settings);
                this._create('types', i, this.members.types);
                this._create('styles', i, this.members.styles);
                this._create('parents', i, this.members.parents, this.prefix + i);
            }
        }
    }
}
