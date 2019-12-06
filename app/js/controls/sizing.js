/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.controls.sizing}
     */
    HC.controls.sizing = class ControlSet extends HC.ControlSet {

        static index = 160;

        settings = {
            sizing_mode: 'off',
            sizing_scale: 1,
            sizing_scale_oscillate: 'off',
            sizing_x: 1,
            sizing_y: 1,
            sizing_z: 1,
            sizing_x_oscillate: 'off',
            sizing_y_oscillate: 'off',
            sizing_z_oscillate: 'off',
            sizing_audio: false,
            sizing_limit: false,
            sizing_sync: true,
            sizing_flip: 'off'
        };
        
        types = {
            sizing_scale: [-10, 10, 0.01, 'half'],
            sizing_x: [-10, 10, 0.01, 'half'],
            sizing_y: [-10, 10, 0.01, 'half'],
            sizing_z: [-10, 10, 0.01, 'half'],
            sizing_x_oscillate: ['half'],
            sizing_y_oscillate: ['half'],
            sizing_z_oscillate: ['half'],
            sizing_scale_oscillate: ['half'],
            sizing_audio: [hex],
            sizing_limit: [hex],
            sizing_sync: [hex]
        };
    }
}