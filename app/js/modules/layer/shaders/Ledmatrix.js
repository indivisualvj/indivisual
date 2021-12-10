/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

class ledmatrix extends ShaderPlugin {
        static index = 210;

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
                value: 16,
                _type: [1, 500, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            size: {
                value: 3,
                _type: [0.5, 250, 0.5],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            blur: {
                value: 2,
                _type: [0, 250, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            punchedplate: {value: false}
        }

        /**
         * @author felixturner / http://airtight.cc/
         *
         * Renders texture as a grid of dots like an LED display.
         * Pass in the webgl canvas dimensions to give accurate pixelization.
         *
         * spacing: distance between dots in px
         * size: radius of dots in px
         * blur: blur radius of dots in px
         * resolution: width and height of webgl canvas
         */
        shader = {

            uniforms: {

                "tDiffuse":   { type: "t", value: null },
                "spacing":    { type: "f", value: 10.0 },
                "size":       { type: "f", value: 4.0 },
                "blur":       { type: "f", value: 4.0 },
                punchedplate: { type: "1i", value: 0 },
                "resolution": { type: "v2", value: new THREE.Vector2( 800, 600) }

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
		uniform float spacing;
		uniform float size;
		uniform float blur;
		uniform vec2 resolution;
		uniform bool punchedplate;
		varying vec2 vUv;
	
		void main() {
	
			vec2 p = vUv;
			if (!punchedplate) {
				vec2 count = vec2(resolution/spacing);
				p = floor(vUv*count)/count;
			}
	
			vec4 color = texture2D(tDiffuse, p);
	
			vec2 pos = mod(gl_FragCoord.xy, vec2(spacing)) - vec2(spacing/2.0);
			float dist_squared = dot(pos, pos);
			float sz = spacing * size;
			gl_FragColor = mix(color, vec4(0.0), smoothstep(sz, sz + size * blur, dist_squared));
		}
	`
        }
    }

export {ledmatrix};
