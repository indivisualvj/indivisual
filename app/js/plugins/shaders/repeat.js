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
` + BlendOperations + `
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

    const BlendOperations = `
        vec4 multiply( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                return s*d;
    
            } else if (s.a > 0.0) {
                return s;
    
            } else {
                return d;
            }
        }
    
        vec4 colorBurn( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                return 1.0 - (1.0 - d) / s;
    
            } else if (s.a > 0.0) {
                return s;
    
            } else {
                return d;
            }
        }
    
        vec4 linearBurn( vec4 s, vec4 d ) {
            return s + d - 1.0;
        }
    
        vec4 colorDodge( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                return d / (1.0 - s);
    
            } else if (s.a > 0.0) {
                return s;
    
            } else {
                return d;
            }
    
        }
    
        float fhardLight( float s, float d ) {
            return (s < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);
        }
    
        vec4 hardLight( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                vec4 c;
                c.x = fhardLight(s.x,d.x);
                c.y = fhardLight(s.y,d.y);
                c.z = fhardLight(s.z,d.z);
                c.a = max(s.a, d.a);
                return c;
    
            } else if (s.a > 0.0) {
                return s;
    
            } else {
                return d;
            }
        }
    
        float fvividLight( float s, float d ) {
            return (s < 0.5) ? 1.0 - (1.0 - d) / (2.0 * s) : d / (2.0 * (1.0 - s));
        }
    
        vec4 vividLight( vec4 s, vec4 d ) {
            vec4 c;
            c.x = fvividLight(s.x,d.x);
            c.y = fvividLight(s.y,d.y);
            c.z = fvividLight(s.z,d.z);
    
            return c;
        }
    
        float fpinLight( float s, float d ) {
            return (2.0 * s - 1.0 > d) ? 2.0 * s - 1.0 : (s < 0.5 * d) ? 2.0 * s : d;
        }
    
        vec4 pinLight( vec4 s, vec4 d ) {
            vec4 c;
            c.x = fpinLight(s.x,d.x);
            c.y = fpinLight(s.y,d.y);
            c.z = fpinLight(s.z,d.z);
    
            return c;
        }
    
        vec4 hardMix( vec4 s, vec4 d ) {
            return floor(s + d);
        }
    
        vec4 difference( vec4 s, vec4 d ) {
            return abs(d - s);
        }
    
        vec4 subtract( vec4 s, vec4 d ) {
            return s - d;
        }
    
        vec4 xor( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                return vec4(0.0);
    
            } else if (s.a > 0.0) {
                return s;
    
            } else {
                return d;
            }
        }
    
        vec4 sourceOver ( vec4 s, vec4 d ) {
            if (s.a > 0.0) {
                return s;
            }
    
            return d;
        }
    
        vec4 destinationOver ( vec4 s, vec4 d ) {
            if (d.a > 0.0) {
                return d;
            }
    
            return s;
        }
    
        vec4 sourceAtop( vec4 s, vec4 d ) {
            if (d.a > 0.0 && s.a > 0.0) {
                return s;
            }
    
            return d;
        }
    
        vec4 sourceIn( vec4 s, vec4 d ) {
            if (d.a > 0.0) {
                return s;
            }
    
            return vec4(0.0);
        }
    
        vec4 sourceOut( vec4 s, vec4 d ) {
            if (d.a == 0.0)
                return s;
    
            return vec4(0.0);
        }
    
        vec4 destinationAtop( vec4 s, vec4 d ) {
            if (d.a > 0.0 && s.a > 0.0) {
                return d;
            }
    
            return s;
        }
    
        vec4 destinationIn( vec4 s, vec4 d ) {
            if (s.a > 0.0) {
                return d;
            }
    
            return vec4(0.0);
        }
    
        vec4 destinationOut( vec4 s, vec4 d ) {
            if (s.a == 0.0)
                return d;
    
            return vec4(0.0);
        }
    
        vec4 add( vec4 s, vec4 d ) {
            s.a /= 2.;
            d.a /= 2.;
    
            return d+s;
        }
    
        vec4 operator(vec4 a, vec4 b, int operator) {
    
            if (operator == 0) {
                return b;
    
            } else if (operator == 1) {
                return sourceAtop(a, b);
    
            } else if (operator == 2) {
                return sourceIn(a, b);
    
            } else if (operator == 3) {
                return sourceOut(a, b);
    
            } else if (operator == 4) {
                return destinationOver(a, b);
    
            } else if (operator == 5) {
                return destinationAtop(a, b);
    
            } else if (operator == 6) {
                return destinationIn(a, b);
    
            } else if (operator == 7) {
                return destinationOut(a, b);
    
            } else if (operator == 8) {
                return xor(a, b);
    
            } else if (operator == 9) {
                return multiply(a, b);
    
            } else if (operator == 10) {
                return difference(a, b);
    
            } else if (operator == 11) {
                return colorDodge(a, b);
    
            } else if (operator == 12) {
                return colorBurn(a, b);
    
            } else if (operator == 13) {
                return hardLight(a, b);
    
            } else if (operator == 14) {
                return add(a, b);
                
            } else if (operator == 15) {
                return sourceOver(a, b);
            }
            
            return sourceOver(a, b);
        }`

}
