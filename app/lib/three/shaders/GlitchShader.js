/**
 * copy of something found on https://www.shadertoy.com/
 */

THREE.GlitchShader = {

    uniforms: {
        "tDiffuse": { type: "t", value: null },
        "twist":     { type: "f", value: 1.0 },
        "brightness":     { type: "f", value: 1.0 },
        offset:   {type: 'v2', value: new THREE.Vector2(1.0, 1.0)},
        zoom:   {type: 'v2', value: new THREE.Vector2(1.0, 1.0)}

    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join( "\n" ),

    fragmentShader: [
"        uniform float brightness;",
"uniform float twist;",
"uniform vec2 zoom;",
"uniform vec2 offset;",
"uniform sampler2D tDiffuse;",
"varying vec2 vUv;",


"void main()",
"{",
"    vec2 uv = vUv;",
"    vec4 c = texture2D(tDiffuse,uv);",
"    uv+=c.bg*offset;",
"    uv-=.5;",
"    float a = atan(uv.y,uv.x);",
"    float d = length(uv);",

"    a+=c.r*(twist);",

"    uv.x = cos(a)*d/zoom.x;",
"    uv.y = sin(a)*d/zoom.y;",
"    uv+=.5;",

"    c = texture2D(tDiffuse,uv)*brightness*1.5;// * c;",
"    gl_FragColor = c;",
"}"

    ].join( "\n" )

};

