HC.plugins.mesh_material.trigonometric = _class(false, HC.MeshMaterialPlugin, {
    apply: function (geometry) {
        var material = new THREE.ShaderMaterial(this.shader);
        material.color = new THREE.Color();
        listener.register('animation.updateRuntime', 'material.uniforms.uTime.value', function (now) {
            material.uniforms.uTime.value = now;
        });
        var mesh = new THREE.Mesh(geometry, material);

        return mesh;
    },

    shader: {
        uniforms: {
            uTime: {type: 'f', value: 1.0}
        },

        // Created by inigo quilez - iq/2013
        // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.


        // Other "Iterations" shaders:
        //
        // "trigonometric"   : https://www.shadertoy.com/view/Mdl3RH
        // "trigonometric 2" : https://www.shadertoy.com/view/Wss3zB
        // "circles"         : https://www.shadertoy.com/view/MdVGWR
        // "coral"           : https://www.shadertoy.com/view/4sXGDN
        // "guts"            : https://www.shadertoy.com/view/MssGW4
        // "inversion"       : https://www.shadertoy.com/view/XdXGDS
        // "inversion 2"     : https://www.shadertoy.com/view/4t3SzN
        // "shiny"           : https://www.shadertoy.com/view/MslXz8
        // "worms"           : https://www.shadertoy.com/view/ldl3W4
        fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            vec2 iterate (in vec2 p, in vec4 t) {
                return p - 0.05*cos(t.xz + p.x*p.y + cos(t.yw+1.5*3.1415927*p.yx)+p.yx*p.yx );
            }

            void main () {
                vec2 q = vUv.xy;
                vec2 p = -1.0 + 2.0*q;
                p *= 1.5;

                vec4 t = 0.15*uTime*vec4( 1.0, -1.5, 1.2, -1.6 ) + vec4(0.0,2.0,3.0,1.0);

                vec2 z = p;
                vec3 s = vec3(0.0);
                for( int i=0; i<100; i++ )
                {
                    z = iterate( z, t );

                    float d = dot( z-p, z-p );
                    s.x += 1.0/(0.1+d);
                    s.y += sin(atan( p.x-z.x, p.y-z.y ));
                    s.z += exp(-0.2*d );
                }
                s /= 100.0;

                vec3 col = 0.5 + 0.5*cos( vec3(0.0,0.4,0.8) + 2.5 + s.z*6.2831 );

                col *= 0.5 + 0.5*s.y;
                col *= s.x;
                col *= 0.94+0.06*sin(10.0*length(z));

                vec3 nor = normalize( vec3( dFdx(s.x), 0.02, dFdy(s.x) ) );
                float dif = dot( nor, vec3(0.7,0.1,0.7) );
                col -= 0.05*vec3(dif);

                col *= 0.3 + 0.7*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.2 );

                gl_FragColor = vec4( col, 1.0 );
            }
        `,

        vertexShader: "varying vec2 vUv;void main(){vUv = uv;vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_Position = projectionMatrix * mvPosition;}"
    }
});

