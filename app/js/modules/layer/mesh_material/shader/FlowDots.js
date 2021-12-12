/**
 * Shader Source https://www.shadertoy.com/view/MtlGz8
 */
import {MeshShaderMaterialPlugin} from "../MeshShaderMaterialPlugin";

class flow_dots extends MeshShaderMaterialPlugin {
    static name = 'flow-dots';
    shader = {
        uniforms: {...MeshShaderMaterialPlugin.standardUniforms},
        fragmentShader: MeshShaderMaterialPlugin.fragmentPrefix + `
                
                const float divs = 12.0;
    
                void mainImage( out vec4 fragColor, in vec2 fragCoord )
                {
                    vec2 div = vec2( divs, divs*iResolution.y/iResolution.x );
                    vec2 uv = fragCoord.xy / iResolution.xy;
                    uv -= 0.5;                                    // center on screen
                //  float b = 4.0*divs/iResolution.x;            // blur over 2.4 pixels
                    vec2 xy = div*uv;
                    
                    vec2 S;
                    S.x = (xy.x + xy.y)*(xy.x - xy.y)*0.5;        // "velocity potential"
                    S.y = xy.x*xy.y;                            // stream function
                    S.x += uTime*1.0;                        // animate stream
                //  S.x += 0.75;
                    
                    vec2 sxy = abs( sin(3.14159265*S) );
                    float a = sxy.x * sxy.y;                    // combine sine waves using product
                    
                    float b = length(fwidth(sxy))*0.7071;        // jacobian
                    a = smoothstep( 0.8-b, 0.8+b, a );            // threshold
                    
                    float c = sqrt( a );                        // correct for gamma
                    fragColor = vec4(c, c, c, 1.0);
                //    fragColor = vec4(c, sxy.x, sxy.y, 1.0);
                }
            ` + MeshShaderMaterialPlugin.fragmentSuffix,
        vertexShader: MeshShaderMaterialPlugin.vertexShader

    }
}

export {flow_dots};
