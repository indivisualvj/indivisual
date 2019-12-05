/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.shape}
     */
    HC.controls.shape = class ControlSet extends HC.ControlSet {

        static index = 100;

        settings = {
            shape_geometry: 'tile',
            shape_sizedivider: 14,
            shape_moda: 0,
            shape_modb: 0,
            shape_modc: 0,
            shape_limit: false,
            shape_sync: true,
            shape_vertices: '',
            shape_transform: 'off',
            shape_transform_volume: 1,
            shape_modifier: 'off',
            shape_modifier_volume: 1,
            shape_pairing: 'off'
        };
    }
}