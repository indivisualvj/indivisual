/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.controls.layer}
     */
    HC.controls.layer = class ControlSet extends HC.ControlSet {

        static index = 10;

        settings = {
            layer_transvisible: false,
            layer_positionx: 0,
            layer_positionx_oscillate: 'off',
            layer_positiony: 0,
            layer_positiony_oscillate: 'off',
            layer_positionz: 0,
            layer_positionz_oscillate: 'off',
            layer_rotationx_oscillate: 'off',
            layer_rotationy_oscillate: 'off',
            layer_rotationz_oscillate: 'off',
            layer_rotationx: 0,
            layer_rotationy: 0,
            layer_rotationz: 0
        };
    }
}