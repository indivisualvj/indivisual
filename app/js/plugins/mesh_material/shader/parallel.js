// fragmentShader by https://www.shadertoy.com/view/tldXR7
{
    HC.plugins.mesh_material.parallel = class Plugin extends HC.MeshShaderMaterialPlugin {

        shader = {
            uniforms: {
                uTime: {type: 'f', value: 1.0},
                uColor: {type: 'v3', value: {r: 1.0, g: 1.0, b: 1.0}}
            },
            fragmentShader: `
                varying vec2 vUv;
                uniform float uTime;
                uniform vec3 uColor;
                
                void main () {
                    float time = uTime/500.0;
                    vec2 iResolution = vec2(1.0);
                    float w = iResolution.x / 5.;
                    float h = iResolution.y / 6.;
                
                    float j = mod(vUv.y / h, 4.);
                
                    float xPos = vUv.x;
                    if (j > 3.)
                        xPos -= 20.*sin(time);
                    else if (j > 2.)
                        xPos -= 20.*cos(time);
                    else if (j > 1.)
                        xPos -= 10.*(time);
                    else
                        xPos += 10.*time;
                    
                    float i = mod(floor(xPos / w), 2.);
                
                    gl_FragColor = vec4(uColor, 1.);
                    if (i >= 1.0) {
                        gl_FragColor = vec4(0);
                    }
                
                    float ij = mod(vUv.y, h);
                    if (ij < 1.)
                        if (i >= 1.)
                            gl_FragColor = vec4(uColor, 1.);
                        else
                            gl_FragColor = vec4(0);
                }
            `
            ,
            vertexShader: "varying vec2 vUv;void main(){vUv = uv;vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_Position = projectionMatrix * mvPosition;}"
        }
    }
}
