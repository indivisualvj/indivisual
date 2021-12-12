/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {DisplaySourcePlugin} from "../DisplaySourcePlugin";

class Offline extends DisplaySourcePlugin
{
    static index = 50;

    getThis() {
        return false;
    }
}

export {Offline}