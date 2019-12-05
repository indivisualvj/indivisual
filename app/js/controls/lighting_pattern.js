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
    }
}