/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.controls.lighting_lookat}
     */
    HC.controls.lighting_lookat = class ControlSet extends HC.ControlSet {

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
    }
}