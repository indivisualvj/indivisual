/**
 * @author felixturner / http://airtight.cc/
 *
 * Draw lines and dots
 * Used in Ripples Viz.
 */

 THREE.RipplesShader = {

	uniforms: {
        "tDiffuse": { type: "t", value: null },
        "time":     { type: "f", value: 1.0 },
        "speed_scale":     { type: "f", value: 20.0 },
        "frequency_scale":     { type: "f", value: 60.0 },
        "amplitude_scale":     { type: "f", value: 0.1 },
        "resolution": { type: "v2", value: new THREE.Vector2( 800, 600)  }
	},

	vertexShader: [

        "varying vec2 vUv;",
        "void main() {",
        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"

	].join("\n"),

	fragmentShader: [
"uniform sampler2D tDiffuse;",
"uniform vec2 resolution;",
"uniform float time;",

"uniform float speed_scale;",
"uniform float frequency_scale;",
"uniform float amplitude_scale;",
"varying vec2 vUv;",

"void main()",
"{",

"    vec2 tc = gl_FragCoord.xy / resolution.xy;",

"    vec2 p = -1.0 + 2.0 * tc;",
"    p.x /= vUv.y/vUv.y;",

"    float len = length(p);",

"    vec2 uv = tc + (p/len)*cos(len*frequency_scale*resolution.y/resolution.y-time*speed_scale)*amplitude_scale*resolution.x/resolution.x;",

"    gl_FragColor = texture2D(tDiffuse, uv);",
"}"

		].join("\n")

	};
