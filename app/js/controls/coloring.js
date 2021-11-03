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
            coloring_mode: 'onergb',
            coloring_volume: 1.0,
            coloring_volume_oscillate: 'off',
            coloring_hue: 0,
            coloring_hue_oscillate: 'off',
            coloring_sat: 1,
            coloring_sat_oscillate: 'off',
            coloring_lum: .5,
            coloring_lum_oscillate: 'off',
            coloring_opacity: 1.0,
            coloring_opacity_oscillate: 'off',
            coloring_limit: false,
            coloring_audio: false,
            coloring_sync: true,
            coloring_emissive: true
        };
        
        types = {
            coloring_volume: [-10.0, 10.0, 0.01],
            coloring_hue: [0, 360, 0.1],
            coloring_lum: [0, 2, 0.01],
            coloring_sat: [0, 2, 0.01],
            coloring_opacity: [0, 1, 0.01],
        };

        styles = {
            coloring_volume: ['half', 'clear'],
            coloring_volume_oscillate: ['half'],
            coloring_hue: ['half', 'clear'],
            coloring_hue_oscillate: ['half'],
            coloring_sat: ['half', 'clear'],
            coloring_sat_oscillate: ['half'],
            coloring_lum: ['half', 'clear'],
            coloring_lum_oscillate: ['half'],
            coloring_opacity: ['half', 'clear'],
            coloring_opacity_oscillate: ['half'],
            coloring_limit: ['quarter', 'clear'],
            coloring_audio: ['quarter'],
            coloring_sync: ['quarter'],
            coloring_emissive: ['quarter'],
        };
    }
}
