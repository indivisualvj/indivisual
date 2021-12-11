/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

if (!IS_CONTROLLER) {
    _importThreeShader('SMAAShader');
    _importThreePostprocessing('SMAAPass');
}

class smaa extends ShaderPlugin {
    static index = 5;
    static settings = {
        apply: false,
        random: false
    }

    create() {
        if (!this.pass) {
            this.pass = new THREE.SMAAPass(this.layer.resolution().x, this.layer.resolution().y);
        }
        this.pass.setSize(this.layer.resolution().x, this.layer.resolution().y);

        return this.pass;
    }
}

export {smaa};
