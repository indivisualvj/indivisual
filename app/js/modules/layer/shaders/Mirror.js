/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

if (!IS_CONTROLLER) {
    _importThreeShader('MirrorShader');
}

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
            this.pass = new THREE.ShaderPass(THREE.MirrorShader);
        }

        return this.pass;
    }
}

export {mirror};
