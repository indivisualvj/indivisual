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
            lighting_color: '#ffffff',
            lighting_intensity: 1,
            lighting_intensity_oscillate: 'off',
            lighting_angle: 1.05,
            lighting_angle_oscillate: 'off',
            lighting_penumbra: 1,
            lighting_penumbra_oscillate: 'off',
            lighting_ambient: false,
            lighting_ambient_intensity: 1,
            lighting_fog: false,
            lighting_shadows: false,
            lighting_fog_near: 1500,
            lighting_fog_far: 2000
        };
        
        types = {
            lighting_fog_near: [0, 5000, 1],
            lighting_fog_far: [500, 10000, 1],
            lighting_intensity: [0, 10.0, 0.01],
            lighting_ambient_intensity: [0, 1.0, 0.01],
            lighting_penumbra: [0, 1, 0.01],
            lighting_angle: [0, 1.05, 0.01],
        };

        styles = {
            lighting_type: ['half', 'clear'],
            lighting_color: ['half'],
            lighting_intensity: ['half', 'clear'],
            lighting_intensity_oscillate: ['half'],
            lighting_angle: ['half', 'clear'],
            lighting_angle_oscillate: ['half'],
            lighting_penumbra: ['half', 'clear'],
            lighting_penumbra_oscillate: ['half'],
            lighting_ambient: ['half', 'clear'],
            lighting_ambient_intensity: ['half'],
            lighting_fog: ['half', 'clear'],
            lighting_shadows: ['half'],
            lighting_fog_near: ['half', 'clear'],
            lighting_fog_far: ['half'],
        };
    }
}