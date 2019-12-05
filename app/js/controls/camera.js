/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.camera}
     */
    HC.controls.camera = class ControlSet extends HC.ControlSet {

        static index = 80;

        settings = {
            camera_mode: 'manual',
            camera_mode_volume: 1.0,
            camera_mode_volume_oscillate: 'off',
            camera_rotationx_oscillate: 'off',
            camera_rotationy_oscillate: 'off',
            camera_rotationz_oscillate: 'off',
            camera_rotationx: 0,
            camera_rotationy: 0,
            camera_rotationz: 0,
            camera_x: 0,
            camera_x_oscillate: 'off',
            camera_y: 0,
            camera_y_oscillate: 'off',
            camera_z:  1,
            camera_z_oscillate: 'off'
        };
    }
}