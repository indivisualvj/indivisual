/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.offset}
     */
    HC.controls.offset = class ControlSet extends HC.ControlSet {

        static index = 170;

        settings = {
            offset_mode: 'off',
            offset_x: 0,
            offset_x_oscillate: 'off',
            offset_y: 0,
            offset_y_oscillate: 'off',
            offset_z: 0,
            offset_z_oscillate: 'off',
            offset_limit: false,
            offset_audio: false,
            offset_sync: true
        };
        
        types = {
            offset_audio: ['third'],
            offset_limit: ['third'],
            offset_sync: ['third'],
            offset_x: [-10, 10, 0.01, 'half'],
            offset_y: [-10, 10, 0.01, 'half'],
            offset_z: [-10, 10, 0.01, 'half'],
            offset_x_oscillate: ['half'],
            offset_y_oscillate: ['half'],
            offset_z_oscillate: ['half'],
        };
    }
}