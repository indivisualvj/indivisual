{
    HC.plugins.shaders.twist = class Plugin extends HC.ShaderPlugin {
        static index = 180;

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
                value: 0.5,
                _type: [0, 1, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            angle: {
                value: 5,
                _type: [-10, 10, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            offset: {
                x: {
                    value: 0.5,
                    _type: [0, 1, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 0.5,
                    _type: [0, 1, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            }
        }

        /**
         * @author alteredq / http://alteredqualia.com/
         *
         * Full-screen textured quad shader
         */

        shader = {

            uniforms: {

                "tDiffuse": { type: "t", value: null },
                radius: {type: 'f', value:0.5},
                angle: {type: 'f', value:5},
                offset: {type: 'v2', value:{x:0.5, y:0.5} },
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

                'varying vec2 vUv;',
                'uniform vec4 resolution;',
                'uniform sampler2D tDiffuse;',

                'uniform float radius;',
                'uniform float angle;',
                'uniform vec2 offset;',

                'void main(void) {',
                '   vec2 coord = vUv - offset;',
                '   float distance = length(coord);',

                '   if (distance < radius) {',
                '       float ratio = (radius - distance) / radius;',
                '       float angleMod = ratio * ratio * angle;',
                '       float s = sin(angleMod);',
                '       float c = cos(angleMod);',
                '       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);',
                '   }',

                '   gl_FragColor = texture2D(tDiffuse, coord+offset);',
                '}'

            ].join( "\n" )

        }
    }
}
