/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.background}
     */
    HC.controls.background = class ControlSet extends HC.ControlSet {

        static index = 70;

        settings = {
            background_mode: 'transparent',
            background_color: '#000000',
            background_input: 'none',
            background_volume: 1,
            // background_mapping: todo background_mapping,
            background_wraps: 'ClampToEdgeWrapping',
            background_wrapt: 'ClampToEdgeWrapping',
            background_repeatx: 1.0,
            background_repeaty: 1.0,
            background_offsetx: 0.0,
            background_offsety: 0.0,
            background_centerx: .5,
            background_centery: .5,
            background_rotation: 0.0,
            background_volume_oscillate: 'off'
        };
    }
}