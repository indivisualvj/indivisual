/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.TwistShader = {

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

};
