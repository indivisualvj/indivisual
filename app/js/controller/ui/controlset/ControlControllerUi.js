/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Messaging} from "../../../shared/Messaging";
import {ControlSetGuifyUi} from "./ControlSetGuifyUi";

class ControlControllerUi extends ControlSetGuifyUi {

    /**
     *
     * @param value
     * @param that
     */
    onChange(value, that) {
        Messaging.program.updateControl(that.getProperty(), value, true, true, false);
    }
}

export {ControlControllerUi}
