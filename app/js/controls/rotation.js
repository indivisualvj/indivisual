/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.rotation}
     */
    HC.controls.rotation = class ControlSet extends HC.ControlSet {

        static index = 140;

        settings = {
            rotation_mode: 'default',
            rotation_x: false,
            rotation_x_random: false,
            rotation_x_volume: 1.0,
            rotation_y: false,
            rotation_y_random: false,
            rotation_y_volume: 1.0,
            rotation_z: false,
            rotation_z_random: false,
            rotation_z_volume: 1.0,
            rotation_sync: true,
            rotation_direction: 'random',
            rotation_easing: 'off',
            rotation_offset_mode: 'off',
            rotation_offsetx: 0.0,
            rotation_offsetx_oscillate: 'off',
            rotation_offsety: 0.0,
            rotation_offsety_oscillate: 'off',
            rotation_offsetz: 0.0,
            rotation_offsetz_oscillate: 'off'
        };
    }
}