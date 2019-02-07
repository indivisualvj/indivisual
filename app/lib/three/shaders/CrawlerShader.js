/**
 * copy of something found on https://www.shadertoy.com/
 */

THREE.CrawlerShader = {

    uniforms: {

        "tDiffuse": { type: "t", value: null },
        displace: { type: "i", value: 1 },
        "time":     { type: "f", value: 0.0 },
        "strength":     { type: "f", value: 0.25 },
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
        "uniform float strength;",
"uniform vec2 resolution;",
        "uniform int displace;",
"uniform sampler2D tDiffuse;",
        "varying vec2 vUv;",

"void main() {",
"    vec4 p = gl_FragCoord/resolution.y - vec4(.9,.5,0,0), c=p-p;",
"    float t=time,",
"        r=length(p.xy+=sin(t+sin(t*.8))*.4),",
"        a=atan(p.y,p.x);",
"    for (float i = 0.;i<40.;i++)",
"    c = c*.98 + (sin(i+vec4(5,3,2,1))*.5+.5)*smoothstep(.99, 1., sin(log(r+i*.05)-t-i+sin(a +=t*.01)));",

"    if (displace==1) {",
"        vec2 uv = vUv + strength*vec2(c*r);",
"        gl_FragColor = texture2D(tDiffuse, uv);",
"    } else {",
"        gl_FragColor = c*r;",
"    }",
"}",

    ].join( "\n" )

};

