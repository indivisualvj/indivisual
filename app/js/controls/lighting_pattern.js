/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.controls.lighting_pattern}
     */
    HC.controls.lighting_pattern = class ControlSet extends HC.ControlSet {

        static index = 60;

        settings = {
            lighting_pattern: 'ring',
            lighting_pattern_lights: 1,
            lighting_pattern_rotation: 0,
            lighting_pattern_rotation_oscillate: 'off',
            lighting_pattern_padding: 1,
            lighting_pattern_padding_oscillate: 'off',
            lighting_pattern_paddingx: 1,
            lighting_pattern_paddingy: 1,
            lighting_pattern_paddingz: 1,
            lighting_pattern_centerx: 0,
            lighting_pattern_centerx_oscillate: 'off',
            lighting_pattern_centery: 0,
            lighting_pattern_centery_oscillate: 'off',
            lighting_pattern_centerz: 1,
            lighting_pattern_centerz_oscillate: 'off'
        };
        
        types = {
            lighting_pattern: ['half'],
            lighting_pattern_lights: [1, 32, 1, 'half'],
            lighting_pattern_rotation: [-4, 4, 0.01, 'half'],
            lighting_pattern_rotation_oscillate: ['half'],
            lighting_pattern_padding: [-10, 10, 0.01, 'half'],
            lighting_pattern_padding_oscillate: ['half'],
            lighting_pattern_paddingx: [-10, 10, 0.01, 'half'],
            lighting_pattern_paddingy: [-10, 10, 0.01, 'half'],
            lighting_pattern_paddingz: [-10, 10, 0.01, 'full'],
            lighting_pattern_centerx: [-5, 5, 0.01, 'half'],
            lighting_pattern_centery: [-5, 5, 0.01, 'half'],
            lighting_pattern_centerz: [-5, 5, 0.01, 'half'],
            lighting_pattern_centerx_oscillate: ['half'],
            lighting_pattern_centery_oscillate: ['half'],
            lighting_pattern_centerz_oscillate: ['half']
        };
    }
}