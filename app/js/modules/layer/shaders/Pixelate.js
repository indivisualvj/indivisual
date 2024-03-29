/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";
import {Vector2} from "three";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";

class pixelate extends ShaderPlugin {
    static index = 220;
    static settings = {
        apply: false,
        random: false,
        size: {
            x: {
                value: 4,
                _type: [1, 64, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            y: {
                value: 4,
                _type: [1, 64, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
    /**
     * copy of something found on https://www.shadertoy.com/
     */
    shader = {

        uniforms: {

            "tDiffuse": {type: "t", value: null},
            size: {type: "v2", value: new Vector2(10, 10)},
            "resolution": {type: "v2", value: new Vector2(800, 600)}

        },

        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",

            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

        ].join("\n"),

        fragmentShader: [

            'varying vec2 vUv;',
            'uniform vec2 resolution;',
            'uniform vec2 size;',
            'uniform sampler2D tDiffuse;',

            'void main() {',
            '   vec2 coord = vUv;',

            '   vec2 sz = resolution.xy/size;',

            '   vec2 color = floor( ( vUv * sz ) ) / sz + size/resolution.xy * 0.5;',
            '   gl_FragColor = texture2D(tDiffuse, color);',
            '}'

        ].join("\n")

    }

    create() {
        if (!this.pass) {
            this.pass = new ShaderPass(this.shader);
        }

        return this.pass;
    }
}

export {pixelate};
