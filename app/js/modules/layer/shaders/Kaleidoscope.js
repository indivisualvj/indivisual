/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

class kaleidoscope extends ShaderPlugin {
    static index = 60;
    static settings = {
        apply: false,
        random: false,
        sides: {
            value: 6,
            _type: [2, 16, 1],
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
        },
        radius: {
            value: 0.5,
            _type: [-5, 5, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        offset: {
            x: {
                value: 0.5,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            y: {
                value: 0.5,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
    /**
     * @author felixturner / http://airtight.cc/
     *
     * Kaleidoscope Shader
     * Radial reflection around center point
     * Ported from: http://pixelshaders.com/editor/
     * by Toby Schachman / http://tobyschachman.com/
     *
     * sides: number of reflections
     * angle: initial angle in radians
     */

    shader = {

        uniforms: {

            "tDiffuse": {type: "t", value: null},
            "sides": {type: "f", value: 6.0},
            "angle": {type: "f", value: 0.0},
            "offset": {type: "v2", value: new THREE.Vector2(.5, .5)}

        },

        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",

            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

        ].join("\n"),

        fragmentShader: [

            "uniform sampler2D tDiffuse;",
            "uniform float sides;",
            "uniform float angle;",
            "uniform vec2 offset;",
            "varying vec2 vUv;",

            "void main() {",

            "vec2 p = vUv - offset;",
            "float r = length(p);",
            "float a = atan(p.y, p.x) + angle;",
            "float tau = 2. * 3.1416 ;",
            "a = mod(a, tau/sides);",
            "a = abs(a - tau/sides/2.) ;",
            "p = r * vec2(cos(a), sin(a));",
            "vec4 color = texture2D(tDiffuse, p + 0.5);",
            "gl_FragColor = color;",

            "}"

        ].join("\n")

    }

    create() {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(this.shader);
        }

        return this.pass;
    }
}

export {kaleidoscope};
