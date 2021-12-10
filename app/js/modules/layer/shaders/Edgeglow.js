/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

class edgeglow extends ShaderPlugin {
        static index = 150;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            color: {
                r: {
                    value: 0,
                    _type: [0, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                g: {
                    value: 1,
                    _type: [0, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                b: {
                    value: 1,
                    _type: [0, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            },
            edgemode: {
                value: 0,
                _type: [0, 2, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }

        /**
         * copy of something found on https://www.shadertoy.com/
         */
        shader = {

            uniforms: {

                "tDiffuse": { type: "t", value: null },
                "color":    { type: "c", value: new THREE.Color( 0xffffff ) },
                "edgemode": { type: "i", value: 0 },
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
                "uniform sampler2D tDiffuse;",
                "uniform vec2 resolution;",
                "uniform int edgemode;",
                "uniform vec3 color;",

                "float lookup(vec2 p, float dx, float dy)",
                "{",
                "float d = sin(5.0)*0.5 + 1.5; // kernel offset",
                "    vec2 uv = (p.xy + vec2(dx, dy)) / resolution.xy;",
                "    vec4 c = texture2D(tDiffuse, uv.xy);",

                "    // return as luma",
                "    return 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;",
                "}",

                "void main(void)",
                "{",
                "    vec2 p = gl_FragCoord.xy;",

                "    // simple sobel edge detection",
                "    float gx = 0.0;",
                "    gx += -1.0 * lookup(p, -1.0, -1.0);",
                "    gx += -2.0 * lookup(p, -1.0,  0.0);",
                "    gx += -1.0 * lookup(p, -1.0,  1.0);",
                "    gx +=  1.0 * lookup(p,  1.0, -1.0);",
                "    gx +=  2.0 * lookup(p,  1.0,  0.0);",
                "    gx +=  1.0 * lookup(p,  1.0,  1.0);",

                "    float gy = 0.0;",
                "    gy += -1.0 * lookup(p, -1.0, -1.0);",
                "    gy += -2.0 * lookup(p,  0.0, -1.0);",
                "    gy += -1.0 * lookup(p,  1.0, -1.0);",
                "    gy +=  1.0 * lookup(p, -1.0,  1.0);",
                "    gy +=  2.0 * lookup(p,  0.0,  1.0);",
                "    gy +=  1.0 * lookup(p,  1.0,  1.0);",

                "    // hack: use g^2 to conceal noise in the video",
                "    float g = gx*gx + gy*gy;",

                "    vec4 col = texture2D(tDiffuse, p / resolution.xy);",
                "    if (edgemode == 0) {",
                "    col += vec4(color.x*g, color.y*g, color.z*g, 1.0);",

                "    } else if (edgemode == 1) {",
                "        col = vec4(color.x*g, color.y*g, color.z*g, 1.0);",
                "    ",
                "    } else {",
                "        // do nothing",
                "    }",

                "    if (col.r == 0.0 && col.g == 0.0 && col.b == 0.0) {",
                "        col.a = 0.0;",
                "    }",

                "    gl_FragColor = col;",
                "}"
            ].join( "\n" )

        }
    }

export {edgeglow};
