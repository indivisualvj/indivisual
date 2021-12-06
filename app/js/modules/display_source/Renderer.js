/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {DisplaySourcePlugin} from "../../shared/DisplaySourcePlugin";

class Renderer extends DisplaySourcePlugin
{
    static index = 1;

    /**
     *
     * @param fallback
     * @param passthrough
     * @returns {*|HTMLElement|*|boolean|*}
     */
    current(fallback, passthrough) {
        return this.renderer.current();
    }
}

export {Renderer};

