/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.controls.lighting}
     */
    HC.controls.lighting = class ControlSet extends HC.ControlSet {

        static index = 40;

        settings = {
            lighting_type: 'off',
            lighting_fog: false,
            lighting_fog_near: 1500,
            lighting_fog_far: 2000,
            lighting_ambient: false,
            lighting_ambient_intensity: 1,
            lighting_bottom: false,
            lighting_color: '#fff',
            lighting_intensity: 1,
            lighting_angle: 1.05,
            lighting_penumbra: 1,
            lighting_intensity_oscillate: 'off',
            lighting_angle_oscillate: 'off',
            lighting_penumbra_oscillate: 'off',
            lighting_shadows: false
        };
        
        types = {
            lighting_intensity_oscillate: ['half'],
            lighting_angle_oscillate: ['half'],
            lighting_penumbra_oscillate: ['half'],
            lighting_fog_near: [0, 5000, 1, 'half'],
            lighting_fog_far: [500, 10000, 1, 'half'],
            lighting_ambient: ['half'],
            lighting_type: ['half'],
            lighting_intensity: [0, 10.0, 0.01, 'half'],
            lighting_ambient_intensity: [0, 1.0, 0.01, 'half'],
            lighting_penumbra: [0, 1, 0.01, 'half'],
            lighting_angle: [0, 1.05, 0.01, 'half'],
            lighting_shadows: ['half'],
            lighting_color: ['half'],
            lighting_fog: ['half']
        };
    }
}