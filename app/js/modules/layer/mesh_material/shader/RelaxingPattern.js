// shader source: https://www.shadertoy.com/view/3l23Rh
import {MeshShaderMaterialPlugin} from "../MeshShaderMaterialPlugin";

class relaxing_pattern extends MeshShaderMaterialPlugin {

    static name = "relaxing-pattern";

    shader = {
        uniforms: {
            uTime: {type: 'f', value: 1.0},
            opacity: {type: 'f', value: 1.0},
            audio: {type: "fv", value: []}
        },
        fragmentShader: MeshShaderMaterialPlugin.fragmentPrefix + `
            uniform float audio[5];
            
            #define iTime uTime
            #define iResolution vec2(1.)
            
            //////////////////////////////////////////////////////////////////////
            uint seed = 0u;
            void hash(){
                seed ^= 2747636419u;
                seed *= 2654435769u;
                seed ^= seed >> 16;
                seed *= 2654435769u;
                seed ^= seed >> 16;
                seed *= 2654435769u;
            }
            void initRandomGenerator(vec2 uv){
                seed = uint(uv.y*iResolution.x + uv.x);
            }
            
            float random(){
                hash();
                return float(seed)/4294967295.0;
            }
            /////////////////////////////////////////////////////////////////////
            float noise(vec2 pos)
            {
                vec2 id, id2, pt;
                float d;
                float dist = 1e5;
                
                id = floor(pos);
                
                for(float x = -1.0; x < 2.0; x++){
                for(float y = -1.0; y < 2.0; y++){
                    id2 = id + vec2(x, y);
                    initRandomGenerator(id2);
                    pt = vec2(random(), random());
                    d = distance(pos, pt + id2);
                    dist = min(dist, d);
                
                }}
                return max(0.0, 1.0 - dist);
                
            }
            float fbm( vec2 pos )
            {
                float f = 0.0;
                float a = 1.0;
                float d = 0.5;
                a*=d;
                f += a*noise(pos); pos*=2.01; a *= d;
                f += a*noise(pos); pos*=2.01; a *= d;
                f += a*noise(pos); pos*=2.01; a *= d;
                f += a*noise(pos); pos*=2.01; a *= d;
                f += a*noise(pos); pos*=2.01; a *= d;
                f += a*noise(pos);
                return f;
            }
            vec3 patern(vec2 pos){
                float beat = audio[2];
                float k = fbm(pos);
                float k2 = fbm(pos + 338.78 + k*4.0 + iTime*0.12 + audio[0] * .125);
                k2*=0.7+beat*0.3;
                return sin(vec3(k2*9.0, k2*7.0+beat*0.3, k2*6.0))*0.5+ 0.5;
            
            }
            
            void mainImage( out vec4 fragColor, in vec2 fragCoord )
            {
                float bass = audio[0];
                float mid = audio[2];
                float highMid = audio[3];
                float treble = audio[4];
            
                vec2 uv = fragCoord/iResolution.y;
                
                vec3 col = patern(uv*2.0);
                uv.x *= iResolution.y/iResolution.x;
                col *= (1.0 + pow(4.0*max(treble - highMid, 0.0), 3.0));
                col *= 0.5 + 0.5*pow( 16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), bass*0.005 );
                fragColor = vec4(col, 1.0);
            }
            ` + MeshShaderMaterialPlugin.fragmentSuffix,
        vertexShader: MeshShaderMaterialPlugin.vertexShader

    }
}

export {relaxing_pattern};
