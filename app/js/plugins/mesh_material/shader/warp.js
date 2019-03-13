// source: https://www.shadertoy.com/
{
    HC.plugins.mesh_material.warp = class Plugin extends HC.MeshShaderMaterialPlugin {
        shader = {

            uniforms: {
                "uTime": {type: "f", value: 0.0},
                "resolution": {type: "v2", value: new THREE.Vector2(800, 600)}
            },
            vertexShader: "varying vec2 vUv;void main(){vUv = uv;vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_Position = projectionMatrix * mvPosition;}",
            fragmentShader: `
                uniform float uTime;
                uniform vec2 resolution;
                varying vec2 vUv;
        
                void main() {
                    vec2 p = vUv - vec2(.9,.5);
                    vec3 c = vec3(p - p, 2);
                    float t = uTime/4.0;
                    float r = length(p.xy+=sin(t+sin(t*.8))*.4);
                    float a = atan(p.y,p.x);
                    for (float i = 0.0; i < 40.0; i++)
                    c = c*.98 + (sin(i+vec3(5,3,2))*.5+.5)*smoothstep(.99, 1., sin(log(r+i*.05)-t-i+sin(a +=t*.01)));
                
                    gl_FragColor = vec4(c*r, 1.0);
                }
            `
        }
    }
}