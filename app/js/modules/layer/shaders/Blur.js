/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

class blur extends ShaderPlugin {
        static index = 120;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            blurX: {
                value: 0.1,
                _type: [0, 500, 0.1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            blurY: {
                value: 0.1,
                _type: [0, 500, 0.1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }

        /**
         * @author zz85 / http://www.lab4games.net/zz85/blog
         *
         * Two pass Gaussian h filter (horizontal and vertical h shaders)
         * - described in http://www.gamerendering.com/2008/10/11/gaussian-h-filter-shader/
         *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
         *
         * - 9 samples per pass
         * - standard deviation 2.7
         * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
         */

        shader = {

            uniforms: {

                "tDiffuse": { type: "t", value: null },
                "blurX":        { type: "f", value: 1.0 },
                "blurY":        { type: "f", value: 1.0 }

            },

            vertexShader: [

                "varying vec2 vUv;",

                "void main() {",

                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                "}"

            ].join( "\n" ),

            fragmentShader: [

                "uniform sampler2D tDiffuse;",
                "uniform float blurX;",
                "uniform float blurY;",

                "varying vec2 vUv;",

                "void main() {",

                "float h = blurX / 8192.0;",
                "float v = blurY / 8192.0;",

                "vec4 sum = vec4( 0.0 );",

                "sum += texture2D(tDiffuse, vec2(vUv.x - 4.0*h, vUv.y)) * 0.05;",
                "sum += texture2D(tDiffuse, vec2(vUv.x - 3.0*h, vUv.y)) * 0.09;",
                "sum += texture2D(tDiffuse, vec2(vUv.x - 2.0*h, vUv.y)) * 0.12;",
                "sum += texture2D(tDiffuse, vec2(vUv.x - h, vUv.y)) * 0.15;",
                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y)) * 0.16;",
                "sum += texture2D(tDiffuse, vec2(vUv.x + h, vUv.y)) * 0.15;",
                "sum += texture2D(tDiffuse, vec2(vUv.x + 2.0*h, vUv.y)) * 0.12;",
                "sum += texture2D(tDiffuse, vec2(vUv.x + 3.0*h, vUv.y)) * 0.09;",
                "sum += texture2D(tDiffuse, vec2(vUv.x + 4.0*h, vUv.y)) * 0.05;",

                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 4.0*v)) * 0.05;",
                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 3.0*v)) * 0.09;",
                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 2.0*v)) * 0.12;",
                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - v)) * 0.15;",
                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y)) * 0.16;",
                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + v)) * 0.15;",
                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 2.0*v)) * 0.12;",
                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 3.0*v)) * 0.09;",
                "sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 4.0*v)) * 0.05;",

                "gl_FragColor = sum;",

                "}"

            ].join( "\n" )

        }
    }


export {blur};
