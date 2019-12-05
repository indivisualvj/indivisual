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
    }
}