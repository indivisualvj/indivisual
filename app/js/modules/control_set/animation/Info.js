/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ControlSet} from "../../../shared/ControlSet";

class Info extends ControlSet {
    static index = 5;
    static _name = 'info';
    visible = false;

    settings = {
        name: 0,
        version: 1.0,
    };

    types = {
        name: ['half'],
        version: ['half']
    };

}

export {Info}