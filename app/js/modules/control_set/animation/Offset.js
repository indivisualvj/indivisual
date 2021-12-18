/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ControlSet} from "../../../shared/ControlSet";

class Offset extends ControlSet {
    static index = 170;

    settings = {
        offset_mode: 'off',
        offset_x: 0,
        offset_x_oscillate: 'off',
        offset_y: 0,
        offset_y_oscillate: 'off',
        offset_z: 0,
        offset_z_oscillate: 'off',
        offset_limit: false,
        offset_audio: false,
        offset_sync: true
    };

    types = {
        offset_x: [-10, 10, 0.01],
        offset_y: [-10, 10, 0.01],
        offset_z: [-10, 10, 0.01]
    };

    styles = {
        // offset_mode: ['half'],
        offset_x: ['half', 'clear'],
        offset_x_oscillate: ['half'],
        offset_y: ['half', 'clear'],
        offset_y_oscillate: ['half'],
        offset_z: ['half', 'clear'],
        offset_z_oscillate: ['half'],
        offset_limit: ['third', 'clear'],
        offset_audio: ['third'],
        offset_sync: ['third'],
    };
}

export {Offset}