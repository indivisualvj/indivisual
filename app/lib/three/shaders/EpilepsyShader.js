/**
 * copy of something found on https://www.shadertoy.com/
 */

THREE.EpilepsyShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"time":        { type: "f", value: 1.0 },
        "size":     { type: "f", value: 1.0 },
        "strength":     { type: "f", value: 1.0 },
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

		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",
        "uniform vec2 resolution;",
        "uniform float time;",
        "uniform float strength;",
        "uniform float size;",
"float map( vec3 p )",
"{",
"    float amp = size;//texture2D( iChannel2, vec2( 0.01, 0.002 ) ).x * 1.0;",
"    vec3 q = fract( p ) * 2.0 - 1.0;",
"    return length( q ) - 0.7;",
"}",

"float trace (vec3 o, vec3 r)",
"{",
"    float amp = size;//texture2D( iChannel2, vec2( 0.1, 0.0 ) ).x * 2.0;",
"    float t = 0.0;",
"    for ( int i = 0; i < 158; ++i ) {",
"    vec3 p = o + r *( 2.3 * amp );",
"    float d = map( p );",
"    t += d * 0.5;",
"}",
"    return t;",

"}",
"void main()",
"{",

"    vec2 R = resolution.xy;",

"    vec2 uv = gl_FragCoord.xy / R;",

"    uv = (2.0 * gl_FragCoord.xy - R) / R.y;",

"    uv.x *= R.x / R.y;",

"    vec3 r = normalize( vec3 ( uv, 1.0 ) );",

"    float the = time * 0.2;",

"    r.xz *= mat2( cos( the ), -sin( the ), sin( the ), cos( the ) );",

"    vec3 o = vec3( 0.0, 0.0, time );",

"    float t = trace( o, r );",

"    float fog = 3.0 / ( 1.0 + t * t * 0.1 );",

"    vec3 fc = vec3( fog );",

"    if (t > 1.0) {",
"        vec4 color = texture2D(tDiffuse, vUv+(fog*strength));",
"        gl_FragColor = color;// * texture2D(tDiffuse, vUv);",

"//    TODO: einstellbar?",
"//    gl_FragColor = vec4( fc, 1.0 );",

"    } else {",
"        gl_FragColor = texture2D(tDiffuse, vUv);",
"    }",
"}",

	].join( "\n" )

};
