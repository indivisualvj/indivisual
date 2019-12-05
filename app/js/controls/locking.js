/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.locking}
     */
    HC.controls.locking = class ControlSet extends HC.ControlSet {

        static index = 150;

        settings = {
            shape_lookat: 'off',
            shape_lookat_centerx: 0.0,
            shape_lookat_centerx_oscillate: 'off',
            shape_lookat_centery: 0.0,
            shape_lookat_centery_oscillate: 'off',
            shape_lookat_centerz: 0.0,
            shape_lookat_centerz_oscillate: 'off',
            pattern_rotation: 'off',
            locking_shapex: false,
            locking_shapey: false,
            locking_shapez: false,
            pattern_rotation_multiplier: 1,
            locking_shapex_multiplier: 1,
            locking_shapey_multiplier: 1,
            locking_shapez_multiplier: 1
        };
    }
}