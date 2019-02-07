/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

THREE.MappingShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 },
		"transform": { type: "m4", value: new THREE.Matrix4() }

	},

	vertexShader: [

		"varying vec2 vUv;",
		"uniform mat4 transform;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * transform * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",

		"}"

	].join( "\n" )

};
