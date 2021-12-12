/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Messaging} from "../../../shared/Messaging";
import {ControlSetGuifyUi} from "./ControlSetGuifyUi";

class DisplayControllerUi extends ControlSetGuifyUi {

    /**
     *
     * @param value
     * @param that
     */
    onChange(value, that) {
        Messaging.program.updateDisplay(that.getProperty(), value, true, true, false);
    }
}

export {DisplayControllerUi}