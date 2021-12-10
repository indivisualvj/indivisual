/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

class worley extends ShaderPlugin {
        static index = 160;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            time: {
                value: 1,
                _type: [-3, 3, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "incrementalpeak"
            },
            strength: {
                value: 0.25,
                _type: [0, 5, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            scale: {
                value: 1,
                _type: [0, 100, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            displace: {value: false}
        }

        /**
         * indivisual + https://www.shadertoy.com/view/llS3RK
         */
        shader = {

            uniforms: {

                "tDiffuse": { type: "t", value: null },
                displace: { type: "i", value: 1 },
                "time":     { type: "f", value: 0.0 },
                "strength":     { type: "f", value: 0.25 },
                scale:   {type: 'f', value: 1.0},
                "resolution": { type: "v2", value: new THREE.Vector2( 800, 600) }

            },

            vertexShader: [

                "varying vec2 vUv;",

                "void main() {",

                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                "}"

            ].join( "\n" ),

            fragmentShader: [


                "        uniform float time;",
                "uniform float strength;",
                "uniform float scale;",
                "uniform vec2 resolution;",
                "uniform bool displace;",
                "uniform sampler2D tDiffuse;",
                "varying vec2 vUv;",
                "float length2(vec2 p) { return dot(p, p); }",

                "float noise(vec2 p){",
                "    return fract(sin(fract(sin(p.x) * (43.13311)) + p.y) * 3.10011*time);",
                "}",

                "float worley(vec2 p) {",
                "    float d = 1e30;",
                "    for (int xo = -1; xo <= 1; ++xo) {",
                "        for (int yo = -1; yo <= 1; ++yo) {",
                "            vec2 tp = floor(p) + vec2(xo, yo);",
                "            d = min(d, length2(p - tp - vec2(noise(tp))));",
                "        }",
                "    }",
                "    return 3.0*exp(-4.0*abs(2.0*d - 1.0));",
                "}",

                "float fworley(vec2 p) {",
                "    return sqrt(sqrt(sqrt(",
                "        2.1 * // light",
                "        worley(p*5. + .3 + time*.0525) *",
                "        sqrt(worley(p * 50. + 0.9 + time * -0.15)) *",
                "        sqrt(sqrt(worley(p * -10. + 9.3))))));",
                "}",

                "        void main() {",
                "            vec2 uv = vUv;",
                "float t = fworley(uv * resolution.xy / 1100.0 * scale);",
                "//    t *= exp(-length2(abs(0.66*uv - 1.0))) * 2.0;",

                "if (displace) {",
                "    vec4 color = texture2D(tDiffuse, uv + vec2(strength*t)-vec2((strength)*.8));",
                "    gl_FragColor = color;",

                "} else {",
                "    vec4 color = texture2D(tDiffuse, uv);",
                "    color.r*=t;",
                "    color.g*=t;",
                "    color.b*=t;",
                "    gl_FragColor = color;",
                "}",

                "}",

            ].join( "\n" )

        }
    }

export {worley};
