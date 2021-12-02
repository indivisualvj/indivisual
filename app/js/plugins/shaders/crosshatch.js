{
    HC.plugins.shaders.crosshatch = class Plugin extends HC.ShaderPlugin {
        static index = 240;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            spacing: {
                value: 10,
                _type: [0.1, 24, 0.1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }

        /**
         * port from PIXI.js
         */
        shader = {

            uniforms: {
                spacing: {type: 'f', value: 1},
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
                "varying vec2 vUv;",
                "uniform sampler2D tDiffuse;",
                "uniform float spacing;",

                "void main(void) {",
                "    float lum = length(texture2D(tDiffuse, vUv.xy).rgb);",
                "    vec4 color = texture2D(tDiffuse, vUv);",

                "    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);//vec4((color.r * 10.0 - 5.0), (color.g * 10.0 - 5.0), (color.b * 10.0 - 5.0), color.a);",

                "    if (lum < 1.00) {",
                "        if (mod(gl_FragCoord.x + gl_FragCoord.y, spacing) == 0.0) {",
                "            gl_FragColor = vec4((color.r * 10.0 - 5.0), (color.g * 10.0 - 5.0), (color.b * 10.0 - 5.0), color.a);",
                "        }",
                "    }",

                "    if (lum < 0.75) {",
                "        if (mod(gl_FragCoord.x - gl_FragCoord.y, spacing) == 0.0) {",
                "            gl_FragColor = vec4((color.g * 10.0 - 5.0), (color.r * 10.0 - 5.0), (color.b * 10.0 - 5.0), color.a);",
                "        }",
                "    }",

                "    if (lum < 0.50) {",
                "        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, spacing) == 0.0) {",
                "            gl_FragColor = vec4((color.b * 10.0 - 5.0), (color.r * 10.0 - 5.0), (color.g * 10.0 - 5.0), color.a);",
                "        }",
                "    }",

                "    if (lum < 0.3) {",
                "        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, spacing) == 0.0) {",
                "            gl_FragColor = vec4((color.g * 10.0 - 5.0), (color.b * 10.0 - 5.0), (color.r * 10.0 - 5.0), color.a);",
                "        }",
                "    }",
                "}"
            ].join("\n")


        }
    }
}
