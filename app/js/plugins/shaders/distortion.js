{
    HC.plugins.shaders.distortion = class Plugin extends HC.ShaderPlugin {
        static index = 90;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            multiplier: {
                value: 0,
                _type: [0, 2, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            strength: {
                value: 0.15,
                _type: [0, 5, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            offset: {
                x: {
                    value: 0.5,
                    _type: [-0.5, 1.5, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 0.5,
                    _type: [-0.5, 1.5, 0.01],
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
                "multiplier":     { type: "f", value: 5.0 },
                "strength": {type: "f", value: 0.12},
                "offset": { type: "v2", value: new THREE.Vector2( 0.5, 0.5) },
                "resolution": { type: "v2", value: new THREE.Vector2( 800, 600) },
                "tDiffuse": { type: "t", value: null }
            },

            vertexShader: [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n"),

            fragmentShader: [
                "uniform vec2 resolution;",
                "uniform sampler2D tDiffuse;",
                "varying vec2 vUv;",
                "uniform float multiplier;",
                "uniform vec2 offset;",
                "uniform float strength;",


                "        float rand(vec2 co){",
                "    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
                "}",
                "void baseLayer (out vec4 layer1Output, in vec2 uv)",
                "{",
                "    float c = sin(uv.y*3.1415*2.0*3.0*1.0) * 0.5 + 0.8 + 0.5;",
                "    layer1Output = vec4(c,c,c,1.0);",
                "}",

                "void main()",
                "{",
                "    vec4 outPutLayer1 = vec4(0.0,0.0,0.0,0.0);",
                "    vec2 uv = vUv.xy;",
                "    baseLayer(outPutLayer1, uv);",

                "    vec4 distortionColor = texture2D(tDiffuse, uv);",
                "    vec4 distortionColor2 = texture2D(tDiffuse, uv);",

                "    distortionColor2.x = 33.1 * rand(vec2(0.0,1.0)) * offset.x;",
                "    distortionColor2.y = 5. * offset.y;",

                "    uv.x += distortionColor.x / 15.0 * strength;",
                "    uv.y += distortionColor.y / 10.0 * strength;",

                "    uv.x += -distortionColor2.x / 25.0 * strength;",
                "    uv.y += -distortionColor2.y / 25.0 * strength;",

                "    vec4 col =",
                "    texture2D(tDiffuse, uv) + distortionColor * multiplier;",

                "    gl_FragColor = col;",

                "}",

            ].join("\n")


        }
    }
}
