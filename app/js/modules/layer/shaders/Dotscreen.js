/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {DotScreenShader} from "three/examples/jsm/shaders/DotScreenShader";

class dotscreen extends ShaderPlugin {
    static index = 200;
    static settings = {
        apply: false,
        random: false,
        scale: {
            value: 0.5,
            _type: [0, 5, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        angle: {
            value: 5,
            _type: [-10, 10, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }

    create() {
        if (!this.pass) {
            this.pass = new ShaderPass(DotScreenShader);
        }

        return this.pass;
    }
}

export {dotscreen};
