{
    HC.plugins.mesh_material.bubbles = class Plugin extends HC.MeshMaterialPlugin {
        apply(geometry) {
            var material = new THREE.ShaderMaterial(this.shader);
            material.color = new THREE.Color();
            listener.register('animation.updateRuntime', 'material.uniforms.uTime.value', function (now) {
                material.uniforms.uTime.value = now;
            });

            return new THREE.Mesh(geometry, material);
        }

        shader = {
            uniforms: {
                uTime: {type: 'f', value: 1.0}
            },
            // Created by inigo quilez - iq/2013
            // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
            fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            void main () {
                vec2 uv = -1.0 + 2.0*vUv.xy;

                // background	 
                vec3 color = vec3(0.8);

                // bubbles	
                for( int i=0; i<40; i++ )
                {
                    // bubble seeds
                    float pha =      sin(float(i)*546.13+1.0)*0.5 + 0.5;
                    float siz = pow( sin(float(i)*651.74+5.0)*0.5 + 0.5, 4.0 );
                    float pox =      sin(float(i)*321.55+4.1);

                    // buble size, position and color
                    float rad = 0.1 + 0.5*siz;
                    vec2  pos = vec2( pox, -1.0-rad + (2.0+2.0*rad)*mod(pha+0.1*uTime*(0.2+0.8*siz),1.0));
                    float dis = length( uv - pos );
                    vec3  col = mix( vec3(0.94,0.3,0.0), vec3(0.1,0.4,0.8), 0.5+0.5*sin(float(i)*1.2+1.9));
                    //    col+= 8.0*smoothstep( rad*0.95, rad, dis );

                    // render
                    float f = length(uv-pos)/rad;
                    f = sqrt(clamp(1.0-f*f,0.0,1.0));
                    color -= col.zyx *(1.0-smoothstep( rad*0.95, rad, dis )) * f;
                }


                gl_FragColor = vec4(color,1.0);
            }`
            ,
            vertexShader: "varying vec2 vUv;void main(){vUv = uv;vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_Position = projectionMatrix * mvPosition;}"
        }
    }
}