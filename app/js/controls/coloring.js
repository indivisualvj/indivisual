/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.coloring}
     */
    HC.controls.coloring = class ControlSet extends HC.ControlSet {

        static index = 120;

        settings = {
            coloring_mode: 'off',
            coloring_volume: 1.0,
            coloring_volume_oscillate: 'off',
            coloring_hue: 0,
            coloring_sat: 1,
            coloring_lum: .5,
            coloring_hue_oscillate: 'off',
            coloring_sat_oscillate: 'off',
            coloring_lum_oscillate: 'off',
            coloring_opacity: 1.0,
            coloring_opacity_oscillate: 'off',
            coloring_audio: false,
            coloring_limit: false,
            coloring_sync: true,
            coloring_emissive: true
        };
    }
}