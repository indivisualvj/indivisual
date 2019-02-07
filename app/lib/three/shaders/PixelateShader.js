/**
 * copy of something found on https://www.shadertoy.com/
 */

THREE.PixelateShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
        size: {type: "v2", value: new THREE.Vector2( 10, 10) },
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
        //'varying vec4 vColor;',
        'uniform vec2 resolution;',
        'uniform vec2 size;',
        'uniform sampler2D tDiffuse;',

        'void main() {',
        '   vec2 coord = vUv;',

        '   vec2 sz = resolution.xy/size;',

        '   vec2 color = floor( ( vUv * sz ) ) / sz + size/resolution.xy * 0.5;',
        '   gl_FragColor = texture2D(tDiffuse, color);',
        '}'

	].join( "\n" )

};
