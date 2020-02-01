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
            background_volume_oscillate: 'off',
            // background_mapping: ,
            background_wraps: 'ClampToEdgeWrapping',
            background_wrapt: 'ClampToEdgeWrapping',
            background_repeatx: 1.0,
            background_repeaty: 1.0,
            background_offsetx: 0.0,
            background_offsety: 0.0,
            background_centerx: .5,
            background_centery: .5,
            background_rotation: 0.0
        };
        
        types = {
            background_volume: [-5, 5, 0.01],
            background_repeatx: [-32, 32, 0.001],
            background_repeaty: [-32, 32, 0.001],
            background_offsetx: [-5, 5, 0.001],
            background_offsety: [-5, 5, 0.001],
            background_centerx: [0, 1, 0.001],
            background_centery: [0, 1, 0.001],
            background_rotation: [-180, 180, 0.01]
        };
        
        styles = {
            background_mode: ['half', 'clear'],
            background_color: ['half'],
            // background_input: ['half'],
            background_volume: ['half', 'clear'],
            background_volume_oscillate: ['half'],
            // background_mapping: ['half'],
            background_wraps: ['half', 'clear'],
            background_wrapt: ['half'],
            background_repeatx: ['half', 'clear'],
            background_repeaty: ['half'],
            background_offsetx: ['half', 'clear'],
            background_offsety: ['half'],
            background_centerx: ['half', 'clear'],
            background_centery: ['half'],
            // background_rotation: ['half'],
        };
    }
}
