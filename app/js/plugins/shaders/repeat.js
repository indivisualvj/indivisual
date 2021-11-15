/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.plugins.shaders.repeat = class Plugin extends HC.ShaderPlugin {
        static index = 45;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            divider: {
                x: {
                    value: 2,
                    _type: [0, 32, 1],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 2,
                    _type: [0, 32, 1],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            },
            zoom: {
                value: 1,
                _type: [0, 10, .01],
                audio: false,
                stepwise: false,
                oscillate: "off",
            },
            operation: {
                value: 0,
                _type: [0, 15, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            flipX: {
                value: 0,
                _type: [0, 1, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            flipY: {
                value: 0,
                _type: [0, 1, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }

        shader = {
            uniforms: {
                "tDiffuse": {type: "t", value: null},
                "resolution": {type: "v2", value: new THREE.Vector2(800, 600)},
                "divider": {type: "v2", value: new THREE.Vector2(800, 600)},
                "operation": {type: "i", value: 0},
                "zoom": {type: "f", value: 1.0},
                "flipX": {type: "i", value: 0},
                "flipY": {type: "i", value: 0}
            },

            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;            
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,

            // todo: put all operations from display, repeat, blendmode, into one operations shader file
            fragmentShader: `

                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                // Tile position
                uniform vec2 from;
                // Tile size by divisions
                uniform vec2 divider;
                // add operation
                uniform int operation;
                uniform float zoom;
                uniform int flipX;
                uniform int flipY;
                uniform vec4 resolution;
` + HC.BlendOperator.repeat.shader + `
                void main() {
                    // Fragment coords
                    vec2 xy = gl_FragCoord.xy;
                    
                    // simple zoom
                    vec2 center = resolution.xy * .5;
                    xy -= center;
                    xy /= zoom;
                    xy -= center;

                    if (flipX == 1) {
                        xy.x = resolution.x - gl_FragCoord.x;
                    }
                    if (flipY == 1) {
                        xy.y = resolution.y - gl_FragCoord.y;
                    }
                    vec2 div = resolution.xy / divider;
                    vec2 phase = fract(xy / div);

                    vec4 s = texture2D(tDiffuse, vUv);
                    vec4 d = texture2D(tDiffuse, phase);

                    gl_FragColor = operator(s, d, operation);
                }
            `,
        }
    }
}
