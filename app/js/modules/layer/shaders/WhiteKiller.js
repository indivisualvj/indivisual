/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";
import {Color} from "three";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";

class brightness_killer extends ShaderPlugin {
    static index = 300;
    static name = 'brightness-killer';
    static settings = {
        apply: false,
        random: false,
        multiplier: {
            value: .5,
            _type: [0, 1, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        color: {
            r: {
                value: .9,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            g: {
                value: .9,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            b: {
                value: .9,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        },
    };
    shader = {
        uniforms: {
            "tDiffuse": {type: "t", value: null},
            "multiplier": {type: "f", value: 0.5},
            "color": {type: "v3", value: new Color(.35, 0.8, 1.4)},
        },

        vertexShader: 'varying vec2 vUv;void main() {vUv = vec2( uv.x, uv.y );gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}',
        fragmentShader: `
                uniform vec3 color;
                uniform float multiplier;
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                void main() {
                
                    vec4 col = texture2D(tDiffuse, vUv);
                    if (col.r > color.r
                     && col.g > color.g
                     && col.b > color.b
                    ) {
                        gl_FragColor = col * multiplier;
                    } else {
                        gl_FragColor = col;
                    }
                }
            `
    }

    create() {
        if (!this.pass) {
            this.pass = new ShaderPass(this.shader);
        }

        return this.pass;
    }
}

export {brightness_killer};
