/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.controls.layer = class ControlSet extends HC.ControlSet {

        static index = 10;

        settings = {
            layer_transvisible: false, // todo z-index needed for arrangements. also maybe layer-numbers as shuffleable to define who plays with whom.
            layer_positionx: 0,
            layer_positionx_oscillate: 'off',
            layer_positiony: 0,
            layer_positiony_oscillate: 'off',
            layer_positionz: 0,
            layer_positionz_oscillate: 'off',
            layer_rotationx: 0,
            layer_rotationx_oscillate: 'off',
            layer_rotationy: 0,
            layer_rotationy_oscillate: 'off',
            layer_rotationz: 0,
            layer_rotationz_oscillate: 'off'
        };
        
        types = {
            layer_positionx: [-5, 5, 0.001],
            layer_positiony: [-5, 5, 0.001],
            layer_positionz: [-5, 5, 0.001],
            layer_rotationx: [-180, 180, 0.001],
            layer_rotationy: [-180, 180, 0.001],
            layer_rotationz: [-180, 180, 0.001]
        };

        styles = {
            // layer_transvisible: ['half'],
            layer_positionx: ['half', 'clear'],
            layer_positionx_oscillate: ['half'],
            layer_positiony: ['half', 'clear'],
            layer_positiony_oscillate: ['half'],
            layer_positionz: ['half', 'clear'],
            layer_positionz_oscillate: ['half'],
            layer_rotationx: ['half', 'clear'],
            layer_rotationx_oscillate: ['half'],
            layer_rotationy: ['half', 'clear'],
            layer_rotationy_oscillate: ['half'],
            layer_rotationz: ['half', 'clear'],
            layer_rotationz_oscillate: ['half'],
        };
    }
}