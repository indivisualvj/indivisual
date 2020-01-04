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
            pattern_rotation_multiplier: 1,
            locking_shapex: false,
            locking_shapex_multiplier: 1,
            locking_shapey: false,
            locking_shapey_multiplier: 1,
            locking_shapez: false,
            locking_shapez_multiplier: 1
        };
        
        types = {
            shape_lookat_centerx: [-2, 2, 0.01],
            shape_lookat_centery: [-2, 2, 0.01],
            shape_lookat_centerz: [-2, 2, 0.01],
            pattern_rotation_multiplier: [-4, 4, 0.001],
            locking_shapex_multiplier: [-4, 4, 0.001],
            locking_shapey_multiplier: [-4, 4, 0.001],
            locking_shapez_multiplier: [-4, 4, 0.001]
        };

        styles = {
            // shape_lookat: ['half'],
            shape_lookat_centerx: ['half', 'clear'],
            shape_lookat_centerx_oscillate: ['half'],
            shape_lookat_centery: ['half', 'clear'],
            shape_lookat_centery_oscillate: ['half'],
            shape_lookat_centerz: ['half', 'clear'],
            shape_lookat_centerz_oscillate: ['half'],
            pattern_rotation: ['half', 'clear'],
            pattern_rotation_multiplier: ['half'],
            locking_shapex: ['half', 'clear'],
            locking_shapex_multiplier: ['half'],
            locking_shapey: ['half', 'clear'],
            locking_shapey_multiplier: ['half'],
            locking_shapez: ['half', 'clear'],
            locking_shapez_multiplier: ['half'],
        };
    }
}