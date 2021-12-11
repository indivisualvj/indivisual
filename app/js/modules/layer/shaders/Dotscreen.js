/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

if (!IS_CONTROLLER) {
    _importThreeShader('DotScreenShader');
}

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
            this.pass = new THREE.ShaderPass(THREE.DotScreenShader);
        }

        return this.pass;
    }
}

export {dotscreen};
