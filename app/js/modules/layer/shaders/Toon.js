/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

class toon extends ShaderPlugin {
        static index = 245;
        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false
        }
        /**
         * @author https://www.shadertoy.com/user/wizgrav / https://www.shadertoy.com/view/ldsfzH
         */
        shader = {

            uniforms: {

                "tDiffuse": { type: "t", value: null },
                "resolution":    { type: "v2", value: new THREE.Vector2( 1280, 720 ) },
            },

            vertexShader: `varying vec2 vUv;void main() {vUv = vec2( uv.x, uv.y );gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`,

            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 resolution;
                varying vec2 vUv;
                // median filter by Morgan McGuire
                #define s2(a, b) temp = a; a = min(a, b); b = max(temp, b);
                #define mn3(a, b, c) s2(a, b); s2(a, c);
                #define mx3(a, b, c) s2(b, c); s2(a, c);
                
                #define mnmx3(a, b, c) mx3(a, b, c); s2(a, b);   // 3 exchanges
                #define mnmx4(a, b, c, d) s2(a, b); s2(c, d); s2(a, c); s2(b, d);  // 4 exchanges
                #define mnmx5(a, b, c, d, e) s2(a, b); s2(c, d); mn3(a, c, e); mx3(b, d, e); // 6 exchanges
                #define mnmx6(a, b, c, d, e, f) s2(a, d); s2(b, e); s2(c, f); mn3(a, b, c); mx3(d, e, f); // 7 exchanges
                
                mat3 sx = mat3( 
                    1.0, 2.0, 1.0, 
                    0.0, 0.0, 0.0, 
                   -1.0, -2.0, -1.0 
                );
                
                mat3 sy = mat3( 
                    1.0, 0.0, -1.0, 
                    2.0, 0.0, -2.0, 
                    1.0, 0.0, -1.0 
                );
                
                vec3 rgb2hsv(vec3 c)
                {
                    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                
                    float d = q.x - min(q.w, q.y);
                    float e = 1.0e-10;
                    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
                }
                
                vec3 hsv2rgb(vec3 c)
                {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }
                
                vec3 toon(vec2 uv) {
                 vec4 texel = texture2D(tDiffuse, uv);
                    vec3 c = texel.rgb;
                    vec3 f = vec3(3.,5.,6.);
                    c = rgb2hsv(c);
                    c = floor(c * f) / f;
                    return c;
                }
                
                vec3 median(vec2 uv, vec2 tsize) {
                
                  vec3 v[9];
                  mat3 I; 
                
                  for(int dX = -1; dX <= 1; ++dX) {
                      for(int dY = -1; dY <= 1; ++dY) {
                        vec2 offset = vec2(float(dX), float(dY));
                        vec3 c = toon(uv.xy + offset * tsize);
                        v[(dX + 1) * 3 + (dY + 1)] = c;
                        I[dX + 1][dY + 1] = c.x * c.y * c.z;
                        
                    }
                  }
                
                  vec3 temp;
                 vec3 orig = v[4];
                  // Starting with a subset of size 6, remove the min and max each time
                  mnmx6(v[0], v[1], v[2], v[3], v[4], v[5]);
                  mnmx5(v[1], v[2], v[3], v[4], v[6]);
                  mnmx4(v[2], v[3], v[4], v[7]);
                  mnmx3(v[3], v[4], v[8]);
                    
                  float gx = dot(sx[0], I[0]) + dot(sx[1], I[1]) + dot(sx[2], I[2]); 
                  float gy = dot(sy[0], I[0]) + dot(sy[1], I[1]) + dot(sy[2], I[2]);
                
                  float g = sqrt(pow(gx, 2.0)+pow(gy, 2.0));
                  return mix(v[4], orig, g) - g;
                }
                
                void main()
                {
                    vec2 uv = vUv.xy;// / resolution.xy;
                    
                    vec3 c = median(uv, 1.6 / resolution.xy);
                    c = hsv2rgb(c); 
                    gl_FragColor = vec4(c,1.0);
                }
            `
        }
    }

export {toon};
