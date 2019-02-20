HC.plugins.mesh_material.hexagons = _class(false, HC.MeshMaterialPlugin, {
    apply: function (geometry) {
        var material = new THREE.ShaderMaterial(HC.HexagonsShader);
        material.color = new THREE.Color();
        material.uniforms.tNoise.value = statics.three.textures.rgbnoise;
        listener.register('animation.updateRuntime', 'mesh_material.hexagons', function (now) {
            material.uniforms.time.value = now;
        });
        var mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
});

HC.HexagonsShader = {
    uniforms: {
        time: {type: 'f', value: 1.0},
        tNoise: {type: 't', value: null}
    },

// Created by inigo quilez - iq/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// { 2d cell id, distance to border, distnace to center )
    fragmentShader: [
            "uniform float time;",
            "uniform sampler2D tNoise;",
            "varying vec2 vUv;",

            "vec4 hexagon( vec2 p ) {",
            "	vec2 q = vec2( p.x*2.0*0.5773503, p.y + p.x*0.5773503 );",
            "	",
            "	vec2 pi = floor(q);",
            "	vec2 pf = fract(q);",

            "	float v = mod(pi.x + pi.y, 3.0);",

            "	float ca = step(1.0,v);",
            "	float cb = step(2.0,v);",
            "	vec2  ma = step(pf.xy,pf.yx);",
            "	",
            "    // distance to borders",
            "	float e = dot( ma, 1.0-pf.yx + ca*(pf.x+pf.y-1.0) + cb*(pf.yx-2.0*pf.xy) );",

            "	// distance to center	",
            "	p = vec2( q.x + floor(0.5+p.y/1.5), 4.0*p.y/3.0 )*0.5 + 0.5;",
            "	float f = length( (fract(p) - 0.5)*vec2(1.0,0.85) );		",
            "	",
            "	return vec4( pi + ca - cb*ma, e, f );",
            "}",

            "float hash1( vec2  p ) { float n = dot(p,vec2(127.1,311.7) ); return fract(sin(n)*43758.5453); }",

            "float noise( in vec3 x ) {",
            "    vec3 p = floor(x);",
            "    vec3 f = fract(x);",
            "	f = f*f*(3.0-2.0*f);",
            "	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;",
            "	vec2 rg = texture2D( tNoise, (uv+0.5)/256.0, 0.0 ).yx;",
            "	return mix( rg.x, rg.y, f.z );",
            "}",


            "void main() {",
            "   vec2 uv = vUv.xy;",
            "	vec2 pos = vUv.xy;",

            "    // distort",
            "	pos *= 1.0 + 0.3*length(pos);",
            "	",
            "    // gray",
            "	vec4 h = hexagon(8.0*pos + 0.5*time);",
            "	float n = noise( vec3(0.3*h.xy+time*0.1,time) );",
            "	vec3 col = 0.15 + 0.15*hash1(h.xy+1.2)*vec3(1.0);",
            "	col *= smoothstep( 0.10, 0.11, h.z );",
            "	col *= smoothstep( 0.10, 0.11, h.w );",
            "	col *= 1.0 + 0.15*sin(40.0*h.z);",
            "	col *= 0.75 + 0.5*h.z*n;",

            "	// red",
            "	h = hexagon(6.0*pos + 0.6*time);",
            "	n = noise( vec3(0.3*h.xy+time*0.1,time) );",
            "	vec3 colb = 0.9 + 0.8*sin( hash1(h.xy)*1.5 + 2.0 + vec3(0.0,1.0,1.0) );",
            "	colb *= smoothstep( 0.10, 0.11, h.z );",
            "	colb *= 1.0 + 0.15*sin(40.0*h.z);",
            "	colb *= 0.75 + 0.5*h.z*n;",

            "	h = hexagon(6.0*(pos+0.1*vec2(-1.3,1.0)) + 0.6*time);",
            "    col *= 1.0-0.8*smoothstep(0.45,0.451,noise( vec3(0.3*h.xy+time*0.1,time) ));",

            "	col = mix( col, colb, smoothstep(0.45,0.451,n) );",

            "	",
            "	col *= pow( 16.0*uv.x*(1.0-uv.x)*uv.y*(1.0-uv.y), 0.1 );",
            "	",
            "	gl_FragColor = vec4( col, 1.0 );",
            "}",


        ].join('\n'),

    vertexShader: "varying vec2 vUv;void main(){vUv = uv;vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_Position = projectionMatrix * mvPosition;}"
};