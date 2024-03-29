/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";

class fxaa extends ShaderPlugin {
    static index = 10;
    static settings = {
        apply: false,
        random: false,
        resolution: {
            x: {
                value: 1,
                _type: [1, 1000, 0.1],
                _func: "valueByWidth",
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            y: {
                value: 1,
                _type: [1, 1000, 0.1],
                _func: "valueByHeight",
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    };

    create() {
        if (!this.pass) {
            this.pass = new ShaderPass(FXAAShader);
        }

        return this.pass;
    }

    updateResolution() {
        if (this.pass) {
            this.pass.uniforms.resolution.value.x = this.valueByWidth(1);
            this.pass.uniforms.resolution.value.y = this.valueByHeight(1);
        }
    }

    valueByWidth(v) {
        return v / this.layer.resolution().x;
    }

    valueByHeight(v) {
        return v / this.layer.resolution().y;
    }
}

export {fxaa};
