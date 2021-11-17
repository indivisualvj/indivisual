// source: https://www.shadertoy.com/
{
    HC.plugins.mesh_material.warp = class Plugin extends HC.MeshShaderMaterialPlugin {
        shader = {

            uniforms: {...HC.MeshShaderMaterialPlugin.standardUniforms},
            fragmentShader: HC.MeshShaderMaterialPlugin.fragmentPrefix + `
        
                void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
                    vec2 p = fragCoord - vec2(.9,.5);
                    vec3 c = vec3(p - p, 2);
                    float t = uTime/4.0;
                    float r = length(p.xy+=sin(t+sin(t*.8))*.4);
                    float a = atan(p.y,p.x);
                    for (float i = 0.0; i < 40.0; i++)
                    c = c*.98 + (sin(i+vec3(5,3,2))*.5+.5)*smoothstep(.99, 1., sin(log(r+i*.05)-t-i+sin(a +=t*.01)));
                
                    fragColor = vec4(c*r, 1.0);
                }
            `
            + HC.MeshShaderMaterialPlugin.fragmentSuffix,
            vertexShader: HC.MeshShaderMaterialPlugin.vertexShader
        }
    }
}