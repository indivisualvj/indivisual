/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.controls.camera = class ControlSet extends HC.ControlSet {

        static index = 80;

        settings = {
            camera_mode: 'manual',
            camera_mode_volume: 1.0,
            camera_mode_volume_oscillate: 'off',
            camera_x: 0,
            camera_x_oscillate: 'off',
            camera_y: 0,
            camera_y_oscillate: 'off',
            camera_z:  1,
            camera_z_oscillate: 'off',
            camera_rotationx: 0,
            camera_rotationx_oscillate: 'off',
            camera_rotationy: 0,
            camera_rotationy_oscillate: 'off',
            camera_rotationz: 0,
            camera_rotationz_oscillate: 'off'
        };
        
        types = {
            camera_rotationx: [-180, 180, 0.01],
            camera_rotationy: [-180, 180, 0.01],
            camera_rotationz: [-180, 180, 0.01],
            camera_mode_volume: [-10, 10, 0.01],
            camera_x: [-5, 5, 0.01],
            camera_y: [-5, 5, 0.01],
            camera_z: [-5, 5, 0.01],
        };

        styles = {
            // camera_mode: ['half'],
            camera_mode_volume: ['half', 'clear'],
            camera_mode_volume_oscillate: ['half'],
            camera_x: ['half', 'clear'],
            camera_x_oscillate: ['half'],
            camera_y: ['half', 'clear'],
            camera_y_oscillate: ['half'],
            camera_z: ['half', 'clear'],
            camera_z_oscillate: ['half'],
            camera_rotationx: ['half', 'clear'],
            camera_rotationx_oscillate: ['half'],
            camera_rotationy: ['half', 'clear'],
            camera_rotationy_oscillate: ['half'],
            camera_rotationz: ['half', 'clear'],
            camera_rotationz_oscillate: ['half'],
        };
    }
}