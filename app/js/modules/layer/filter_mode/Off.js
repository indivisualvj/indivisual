/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {FilterModePlugin} from "../FilterModePlugin";

class off extends FilterModePlugin
{
    static name = 'off';
    static index = 1;

    apply(shape) {
    }
}

export {off}