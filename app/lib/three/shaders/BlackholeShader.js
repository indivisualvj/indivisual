/**
 * copy of something found on https://www.shadertoy.com/
 */

THREE.BlackholeShader = {

    uniforms: {

        "tDiffuse": { type: "t", value: null },
        "time":     { type: "f", value: 1.0 },
        "strength":     { type: "f", value: 0.25 },
        //offset:   {type: '2f', value:{x:0.5, y:0.5}},
        scale:   {type: 'f', value: 1.0},
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

"        uniform float time;",
"uniform float scale;",
"uniform float strength;",
"//uniform vec2 offset;",
"uniform vec2 resolution;",
"uniform sampler2D tDiffuse;",
"#define ITERATIONS 10",
"varying vec2 vUv;",

"void main () {",

"    float time = time * 2. + 15.;",
"    vec2 res = resolution.xy;",
"    vec2 uv = gl_FragCoord.xy / res - vec2(.5);",
"    uv *= vec2(res.x / res.y, 1.) * 4. * scale;",

"    float len = dot(uv, uv) * .3 - .4;",

"    vec3 z = sin(time * vec3(.23, .19, .17));",
"    for (int i = 0; i < ITERATIONS; i++) {",
"        z += cos(z.zxy + uv.yxy * float(i) * len);",
"    }",

"    float val = z.r * .06 + .3;",
"    val -= smoothstep(.1, -.3, len) * 1.5 + len * .3 - .4;",
"    vec2 of = vec2(-strength)*.5;",
"    vec4 col = texture2D(tDiffuse, vUv + of + val * strength);",
"    gl_FragColor = vec4(vec3(val*col.r, val*col.g, val*col.b), col.a);",

"}",

    ].join( "\n" )

};

