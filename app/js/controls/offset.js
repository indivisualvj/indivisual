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
            offset_audio: false,
            offset_limit: false,
            offset_sync: true,
            offset_x: 0,
            offset_x_oscillate: 'off',
            offset_y: 0,
            offset_y_oscillate: 'off',
            offset_z: 0,
            offset_z_oscillate: 'off'
        };
    }
}