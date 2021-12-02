{
    HC.plugins.shaders.glitch = class Plugin extends HC.ShaderPlugin {
        static index = 100;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            twist: {
                value: 1,
                _type: [0, 64, 0.1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            brightness: {
                value: 1,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            offset: {
                x: {
                    value: 0.5,
                    _type: [-2, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 0.5,
                    _type: [-2, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            },
            zoom: {
                x: {
                    value: 1,
                    _type: [0.1, 8, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 1,
                    _type: [0.1, 8, 0.01],
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
                "tDiffuse": { type: "t", value: null },
                "twist":     { type: "f", value: 1.0 },
                "brightness":     { type: "f", value: 1.0 },
                offset:   {type: 'v2', value: new THREE.Vector2(1.0, 1.0)},
                zoom:   {type: 'v2', value: new THREE.Vector2(1.0, 1.0)}

            },

            vertexShader: [

                "varying vec2 vUv;",

                "void main() {",

                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                "}"

            ].join( "\n" ),

            fragmentShader: [
                "        uniform float brightness;",
                "uniform float twist;",
                "uniform vec2 zoom;",
                "uniform vec2 offset;",
                "uniform sampler2D tDiffuse;",
                "varying vec2 vUv;",


                "void main()",
                "{",
                "    vec2 uv = vUv;",
                "    vec4 c = texture2D(tDiffuse,uv);",
                "    uv+=c.bg*offset;",
                "    uv-=.5;",
                "    float a = atan(uv.y,uv.x);",
                "    float d = length(uv);",

                "    a+=c.r*(twist);",

                "    uv.x = cos(a)*d/zoom.x;",
                "    uv.y = sin(a)*d/zoom.y;",
                "    uv+=.5;",

                "    c = texture2D(tDiffuse,uv)*brightness*1.5;// * c;",
                "    gl_FragColor = c;",
                "}"

            ].join( "\n" )

        }
    }
}
