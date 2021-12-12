/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {RGBShiftShader} from "three/examples/jsm/shaders/RGBShiftShader";

class rgbsplit extends ShaderPlugin {
    static index = 190;
    static settings = {
        apply: false,
        random: false,
        amount: {
            value: 0.005,
            _type: [0, 3, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        angle: {
            value: 0,
            _type: [-5, 5, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }

    create() {
        if (!this.pass) {
            this.pass = new ShaderPass(RGBShiftShader);
        }

        return this.pass;
    }
}

export {rgbsplit};
