/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.pattern}
     */
    HC.controls.pattern = class ControlSet extends HC.ControlSet {

        static index = 90;

        settings = {
            pattern: 'matrix',
            pattern_padding: 1.0,
            pattern_paddingx: 1.0,
            pattern_paddingy: 1.0,
            pattern_paddingz: 1.0,
            pattern_centerx: 0,
            pattern_centery: 0,
            pattern_centerz: 0,
            pattern_audio: false,
            pattern_limit: false,
            pattern_padding_oscillate: 'off',
            pattern_shapes: 112,
            pattern_sync: true,
            pattern_mover: 'off',
            pattern_overlay: 'off',
            pattern_overlay_volume: 0.0,
            pattern_overlay_volume_oscillate: 'off'
        };
        
        types = {
            pattern: ['half'],
            pattern_padding: [-10, 10, 0.01, 'half'],
            pattern_paddingx: [-10, 10, 0.01, 'half'],
            pattern_paddingy: [-10, 10, 0.01, 'half'],
            pattern_paddingz: [-10, 10, 0.01, 'half'],
            pattern_audio: [third],
            pattern_limit: [third],
            pattern_padding_oscillate: ['half'],
            pattern_shapes: [0, 512, 1, 'half'],
            pattern_sync: [third],
            pattern_mover: ['half'],
            pattern_centerx: [-5, 5, 0.01, 'half'],
            pattern_centery: [-5, 5, 0.01, 'half'],
            pattern_centerz: [-5, 5, 0.01, 'half'],
            pattern_overlay: ['half'],
            pattern_overlay_volume: [0, 1.0, 0.01, 'half'],
            pattern_overlay_volume_oscillate: ['half']
        };
    }
}