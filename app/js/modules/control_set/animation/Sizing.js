/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ControlSet} from "../../../shared/ControlSet";

class Sizing extends ControlSet {
    static index = 160;

    settings = {
        sizing_mode: 'off',
        sizing_scale: 1,
        sizing_scale_oscillate: 'off',
        sizing_x: 1,
        sizing_x_oscillate: 'off',
        sizing_y: 1,
        sizing_y_oscillate: 'off',
        sizing_z: 1,
        sizing_z_oscillate: 'off',
        sizing_flip: 'off',
        sizing_limit: false,
        sizing_audio: false,
        sizing_sync: true
    };

    types = {
        sizing_scale: [-10, 10, 0.01],
        sizing_x: [-10, 10, 0.01],
        sizing_y: [-10, 10, 0.01],
        sizing_z: [-10, 10, 0.01],
    };

    styles = {
        // sizing_mode: ['half'],
        sizing_scale: ['half', 'clear'],
        sizing_scale_oscillate: ['half'],
        sizing_x: ['half', 'clear'],
        sizing_x_oscillate: ['half'],
        sizing_y: ['half', 'clear'],
        sizing_y_oscillate: ['half'],
        sizing_z: ['half', 'clear'],
        sizing_z_oscillate: ['half'],
        sizing_flip: ['half', 'clear'],
        sizing_limit: ['hex'],
        sizing_audio: ['hex'],
        sizing_sync: ['hex'],
    };
}

export {Sizing}