/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

class smudge_blur extends ShaderPlugin {
        static index = 109;
        static name = 'smudge-blur';

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,

            radius: {
                value: 0.015,
                _type: [0, 1, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            iterations: {
                value: 32,
                _type: [1, 128, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },

        }

        shader = {

            uniforms: {
                "iterations":     { type: "f", value: 32 },
                "radius": {type: "f", value: 0.015},
                "resolution": { type: "v2", value: new THREE.Vector2( 1, 1) },
                "tDiffuse": { type: "t", value: null }
            },

            vertexShader: 'varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}',

            fragmentShader: ` 
                // 'Smudge Blur' by tesuji (2011)
                // An attempt at bokeh blur with extra warpyness
                uniform float radius;
                uniform float iterations;
                uniform vec2 resolution;
                uniform sampler2D tDiffuse;
                
                void main(void)
                {
                    vec2 p = gl_FragCoord.xy / resolution.xy;
                
                    vec3 color = vec3(0,0,0);
                    for (float i=0.0; i<360.0/iterations; i++)
                    {
                    vec2 uv;
                    uv.x = (p.x + sin(i*iterations)*radius*color.r);
                    uv.y = (p.y + cos(i*iterations)*radius*(color.g+color.b));
                        color += texture2D(tDiffuse, uv).xyz;
                    } 
                
                    color = color/(360.0/iterations);
                    gl_FragColor = vec4(color,1.0);
                }
            `,
        }
    }

export {smudge_blur};
