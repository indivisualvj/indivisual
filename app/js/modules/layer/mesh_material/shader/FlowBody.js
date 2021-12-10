/**
 * Shader Source https://www.shadertoy.com/view/lts3zN
 */
import {MeshShaderMaterialPlugin} from "../MeshShaderMaterialPlugin";

class flow_body extends MeshShaderMaterialPlugin {
        static name = 'flow-body';
        shader = {
            uniforms: {...MeshShaderMaterialPlugin.standardUniforms},
            fragmentShader: MeshShaderMaterialPlugin.fragmentPrefix + `
                                
                #define DOTS
                const float LN2 = 0.693147181;	// natural log of 2 used to convert Log2 to LogE
                const float SourceMag = 2.55;
                const float SinkMag = -SourceMag;
                const float divs = 50.0;
                    
                void mainImage( out vec4 fragColor, in vec2 fragCoord )
                {
                    vec2 div = vec2( divs, divs*iResolution.y/iResolution.x );
                    vec2 uv = fragCoord.xy / iResolution.xy;
                    uv -= 0.5;									// center on screen
                    vec2 p = div*uv;
                    vec2 q; 
                    vec2 d = vec2( 8.0, 0.0 );
                    
                    // Velocity Potential in x, Stream fn in y, 
                    vec2 S;
                    
                    // init with position to get horizontal flow
                    S = p;	
                    S.x -= uTime*2.0;						// animate stream
                    
                    // Source
                    q = p + d;
                    S.x += SourceMag*log2(dot(q,q))*LN2*0.5;
                    S.y += SourceMag*atan(q.y,q.x);
                
                    // Sink
                    q = p - d;
                    S.x += SinkMag*log2(dot(q,q))*LN2*0.5;
                    S.y += SinkMag*atan(q.y,q.x);
                
                //	Corner flow
                //	S.x = (p.x + p.y)*(p.x - p.y)*0.5;			// "velocity potential"
                //	S.y = p.x*p.y;								// stream function
                
                    vec2 sxy;
                    float a;
                #ifdef DOTS
                    sxy = abs( sin(3.14159265*S) );
                    a = sxy.x * sxy.y;							// combine sine waves using product
                    float b = length(fwidth(sxy))*0.7071;		// jacobian magnitude
                    float t = 0.8;								// threshold
                    a = smoothstep( t-b, t+b, a );				// blend across threshold
                //	a = mix( t-b, t+b, a );
                #else
                    sxy = sin(3.14159*S);
                    vec2 b = fwidth(sxy)*0.7071;				// jacobian
                    sxy = smoothstep( -b, b, sxy );
                    sxy = 2.0*sxy - 1.0;						// remap to [-1..1]
                    a = 0.5*(sxy.x * sxy.y) + 0.5;				// combine sine waves and remap to [0..1]
                #endif
                    
                    float c = sqrt( a );						// correct for gamma
                    fragColor = vec4(c, c, c, 1.0);
                //	fragColor = vec4(c, sxy.x, sxy.y, 1.0);
                }
            ` + MeshShaderMaterialPlugin.fragmentSuffix,
            vertexShader: MeshShaderMaterialPlugin.vertexShader
            
        }
    }

export {flow_body};
