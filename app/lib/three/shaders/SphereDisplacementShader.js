/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.SphereDisplacementShader = {

    uniforms: {

        "tDiffuse": { type: "t", value: null },
        "time":     { type: "f", value: 0.0 },
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
"        uniform vec2 resolution;",
"uniform sampler2D tDiffuse;",
"varying vec2 vUv;",
"//uniform vec2 offset;",
"//uniform float strength;",
"uniform float time;",

"float box( vec3 p ) {",
"    float s = sin(time);",
"    float c = cos(time);",
"    p -= vec3(0.,s,1.); // translate",
"    float xn = c * p.x - s * p.z;",
"    float zn = s * p.x + c * p.z;",
"    p = vec3(xn, p.y, zn); // rotate",
"    return length(max(abs(p)-vec3(0.4),0.0));",
"}",

"float sphere ( vec3 p ) {",
"    p -= vec3(0.,0.,1.);",
"    return length(p) - 0.5;",
"}",

"float scene(vec3 p) {",
"    float b = box(p);",
"    float s = sphere(p);",

"    //source of all the funkyness",
"    return min(b,s) - .01/(b-s);",
"}",

"void main()",
"{",
"    float mx = max( resolution.x, resolution.y );",
"    vec3 p = vec3((vUv-.5)*2., .0);",
"    vec2 nuv = vec2(scene(p));",
"    vec4 org = texture2D(tDiffuse, vUv * (nuv));",

"    gl_FragColor = org;",
"}",

    ].join( "\n" )

};

