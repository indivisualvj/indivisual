/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";
import {Vector2} from "three";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";

class noise extends ShaderPlugin {
    static index = 110;
    static settings = {
        apply: false,
        random: false,
        smoothness: {
            value: 0.02,
            _type: [0, 32, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        threshold: {
            value: 1,
            _type: [0.5, 2, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    };
    /**
     * copy and mashup of something found on https://www.shadertoy.com/
     */
    shader = {
        uniforms: {
            "tDiffuse": {type: "t", value: null},
            "smoothness": {type: "f", value: 0.0},
            "threshold": {type: "f", value: 1.0},
            "resolution": {type: "v2", value: new Vector2(800, 600)}
        },

        vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`
        ,
        fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 resolution;
                uniform float smoothness;
                uniform float threshold;
                varying vec2 vUv;
                const float tau = 6.2831853;
        
                mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
                float noise( in vec2 x ){return texture2D(tDiffuse, x).x;}
                
                float fbm(in vec2 p)
                {
                    float z=1.*threshold;
                    float rz = 0.;
                    vec2 bp = p;
                    for (float i= 1.;i < 6.;i++)
                    {
                        rz+= abs((noise(p)-0.5)*2.)/z;
                        z = z*2.;
                        p = p*2.;
                    }
                    return rz;
                }
                
                float dualfbm(in vec2 p)
                {
                    //get two rotated fbm calls and displace the domain
                    vec2 p2 = p*.7;
                    vec2 basis = vec2(fbm(p2-smoothness*0.016),fbm(p2+smoothness*0.017));
                    basis = (basis-.5)*.2;
                    p += basis;
                
                    //coloring
                    return fbm(p*makem2(smoothness*0.002));
                }
                
                float circ(vec2 p)
                {
                    float r = length(p);
                    r = log(sqrt(r));
                    return abs(mod(r*4.,tau)-3.14)*3.+.2;
                
                }
                
                void main()
                {
                    //setup system
                    vec2 p = vUv.xy / resolution.xy;
                    p.x *= resolution.x/resolution.y;
                    p*=4.;
                
                    float rz = dualfbm(p);
                
                //    //rings
                //    p /= exp(mod(smoothness*10.,3.14159));
                //    rz *= pow(abs((0.1-circ(p))),.9);
                
                    //final color
                        vec4 ocol = texture2D(tDiffuse, vUv);
                    vec3 col = vec3(1.,1.,1.)/rz;
                    col=pow(abs(col),vec3(.99));
                    gl_FragColor = vec4(col,1.) * ocol;
                }`
    }

    create() {
        if (!this.pass) {
            this.pass = new ShaderPass(this.shader);
        }

        return this.pass;
    }
}

export {noise};
