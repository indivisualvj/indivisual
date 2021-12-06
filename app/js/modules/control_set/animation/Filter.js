/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ControlSet} from "../../../shared/ControlSet";

class Filter extends ControlSet
{
    static index = 130;

    settings = {
        filter_mode: 'off',
        filter_audio: false,
        filter_limit: false,
        filter_sync: false,
        filter_volume: 1.0,
        filter_volume_oscillate: 'off'
    };

    types = {
        filter_volume: [-10, 10, 0.01]
    };

    styles = {
        filter_mode: ['half', 'clear'],
        filter_audio: ['hex'],
        filter_limit: ['hex'],
        filter_sync: ['hex'],
        filter_volume: ['half', 'clear'],
        filter_volume_oscillate: ['half'],
    };
}

export {Filter}