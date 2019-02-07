/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

THREE.ColorifyShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"color":    { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec3 color;",
		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",

			//"vec3 luma = vec3( 0.299, 0.587, 0.114 );",
			//"float v = dot( texel.xyz, luma );",

			//"gl_FragColor = vec4( v * color, texel.w );",
        "gl_FragColor = vec4(texel.r * color.x, texel.g * color.y, texel.b * color.z, texel.a);",

		"}"

	].join( "\n" )

};
