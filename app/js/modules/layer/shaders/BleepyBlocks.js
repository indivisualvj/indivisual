/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

class bleepy_blocks extends ShaderPlugin {
        static index = 200;
        static name = 'bleepy-blocks';

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
                value: 1.0,
                _type: [-10, 10, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "incremental"
            },
            tiles: {
                value: 64,
                _type: [1, 1024, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            intensity: {
                value: .5,
                _type: [0, 2, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            size: {
                x: {
                    value: 1.0,
                    _type: [0, 3, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 1.0,
                    _type: [0, 3, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
            },
            color: {
                r: {
                    value: 0.35,
                    _type: [0, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                g: {
                    value: 0.8,
                    _type: [0, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                b: {
                    value: 1.4,
                    _type: [0, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            },
        };

        shader = {
            uniforms: {
                "tDiffuse": { type: "t", value: null },
                "resolution": { type: "v2", value: new THREE.Vector2( 800, 600) },
                "size": { type: "v2", value: new THREE.Vector2( 1.0, 1.0 ) },
                "time": { type: "f", value: 0.95 },
                "intensity": { type: "f", value: 0.5 },
                "tiles": { type: "i", value: 64 },
                "color": { type: "v3", value: new THREE.Color(.35, 0.8, 1.4) },
            },

            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = vec2( uv.x, uv.y );
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`
            ,
            fragmentShader: `
                // By Daedelus: https://www.shadertoy.com/user/Daedelus
                // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
                #include <common>
                
                varying vec2 vUv;
                uniform vec2 resolution;
                uniform float time;
                uniform float intensity;
                uniform int tiles;
                uniform vec3 color;
                uniform vec2 size;
                uniform sampler2D tDiffuse;
                
                // By Daedelus: https://www.shadertoy.com/user/Daedelus
                // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
                #define TIMESCALE .5
                
                void mainImage( out vec4 fragColor, in vec2 fragCoord )
                {
                    vec2 uv = fragCoord.xy / resolution.xy;
                    float ratio = resolution.x / resolution.y;
                    float tilesX = float(tiles);
                    float tilesY = float(tiles) / ratio;
                    vec2 tileRes = vec2(tilesX, tilesY);
                    
                    vec2 noiseUv = floor(vec2(uv.x * tilesX, uv.y * tilesY)) / tileRes;

                    vec4 noise = texture2D(tDiffuse, noiseUv);
                    float p = 1.0 - mod(noise.r + noise.g + noise.b + time * float(TIMESCALE), 1.0);
                    p = min(max(p * 3.0 - 1.8, 0.1), 2.0);
                    
                    vec2 r = mod(vec2(uv.x * float(tiles), uv.y * float(tiles) / ratio), 1.0);
                    r = vec2(pow(r.x - 0.5, 2.0) / size.x, pow(r.y - 0.5, 2.0) / size.y);
                    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), intensity); // todo: invert? by not substracting from 1.0?
                    fragColor = vec4(color, 1.0) * p;
                }
                
                void main() {
                    //mainImage(gl_FragColor, vUv * resolution.xy);
                    mainImage(gl_FragColor, gl_FragCoord.xy);
                }
            `
        }
    }

export {bleepy_blocks};
