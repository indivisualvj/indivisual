/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.control_set.lighting_lookat = class ControlSet extends HC.ControlSet {

        static index = 50;

        settings = {
            lighting_lookat: 'center',
            lighting_lookat_centerx: 0,
            lighting_lookat_centerx_oscillate: 'off',
            lighting_lookat_centery: 0,
            lighting_lookat_centery_oscillate: 'off',
            lighting_lookat_centerz: -1,
            lighting_lookat_centerz_oscillate: 'off'
        };
        
        types = {
            lighting_lookat_centerx: [-5, 5, 0.01],
            lighting_lookat_centery: [-5, 5, 0.01],
            lighting_lookat_centerz: [-5, 5, 0.01],
        };

        styles = {
            // lighting_lookat: ['half'],
            lighting_lookat_centerx: ['half', 'clear'],
            lighting_lookat_centerx_oscillate: ['half'],
            lighting_lookat_centery: ['half', 'clear'],
            lighting_lookat_centery_oscillate: ['half'],
            lighting_lookat_centerz: ['half', 'clear'],
            lighting_lookat_centerz_oscillate: ['half'],
        };
    }
}