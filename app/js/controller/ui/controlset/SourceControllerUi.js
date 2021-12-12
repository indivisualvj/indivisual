/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {ControlSetGuifyUi} from "./ControlSetGuifyUi";
import {Messaging} from "../../../shared/Messaging";

class SourceControllerUi extends ControlSetGuifyUi {

    /**
     *
     * @param value
     * @param that
     */
    onChange(value, that) {
        Messaging.program.updateSource(that.getProperty(), value, true, true, false);
    }
}

export {SourceControllerUi}