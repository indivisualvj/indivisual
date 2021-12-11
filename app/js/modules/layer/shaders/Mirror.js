/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";
import {MirrorShader} from "three/examples/jsm/shaders/MirrorShader";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";

class mirror extends ShaderPlugin {
    static index = 50;
    static settings = {
        apply: false,
        random: false,
        side: {
            value: 1,
            _type: [0, 3, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }

    create() {
        if (!this.pass) {
            this.pass = new ShaderPass(MirrorShader);
        }

        return this.pass;
    }
}

export {mirror};
