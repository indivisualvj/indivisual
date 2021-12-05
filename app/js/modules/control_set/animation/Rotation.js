/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class Rotation extends ControlSet
{
    static index = 140;

    settings = {
        rotation_mode: 'default',
        rotation_sync: true,
        rotation_direction: 'random',
        rotation_easing: 'off',
        rotation_x: false,
        rotation_x_random: false,
        rotation_x_volume: 1.0,
        rotation_y: false,
        rotation_y_random: false,
        rotation_y_volume: 1.0,
        rotation_z: false,
        rotation_z_random: false,
        rotation_z_volume: 1.0,
        rotation_offset_mode: 'off',
        rotation_offsetx: 0.0,
        rotation_offsetx_oscillate: 'off',
        rotation_offsety: 0.0,
        rotation_offsety_oscillate: 'off',
        rotation_offsetz: 0.0,
        rotation_offsetz_oscillate: 'off'
    };

    types = {
        rotation_x_volume: [-4, 4, 0.01],
        rotation_y_volume: [-4, 4, 0.01],
        rotation_z_volume: [-4, 4, 0.01],
        rotation_offsetx: [-4, 4, 0.01],
        rotation_offsety: [-4, 4, 0.01],
        rotation_offsetz: [-4, 4, 0.01]
    };

    styles = {
        rotation_mode: ['half', 'clear'],
        rotation_sync: ['half'],
        rotation_direction: ['half', 'clear'],
        rotation_easing: ['half'],
        rotation_x: ['quarter', 'clear'],
        rotation_x_random: ['quarter'],
        rotation_x_volume: ['half'],
        rotation_y: ['quarter', 'clear'],
        rotation_y_random: ['quarter'],
        rotation_y_volume: ['half'],
        rotation_z: ['quarter', 'clear'],
        rotation_z_random: ['quarter'],
        rotation_z_volume: ['half'],
        rotation_offsetx: ['half', 'clear'],
        rotation_offsetx_oscillate: ['half'],
        rotation_offsety: ['half', 'clear'],
        rotation_offsety_oscillate: ['half'],
        rotation_offsetz: ['half', 'clear'],
        rotation_offsetz_oscillate: ['half']
    };
}

export {Rotation}