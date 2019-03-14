/**
 * @author unknown + indivisualvj / https://github.com/indivisualvj
 */

THREE.BlendmodeShader = {

    uniforms: {

        "tDiffuse": { type: "t", value: null },
        "resolution": { type: "v2", value: new THREE.Vector2( 800, 600) },
        "strength": { type: "f", value: 1.0 },
        "operator_one": { type: "i", value: 1 },
        "operator_two": { type: "i", value: 1 }
    },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = vec2( uv.x, uv.y );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,

    fragmentShader: `

        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform vec2 resolution;
        uniform float strength;
        uniform int operator_one;
        uniform int operator_two;

        const vec3 lumi = vec3(1.0, 1.0, 1.0);
                
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
        
        vec3 darken( vec3 s, vec3 d )
        {
            return min(s,d);
        }
        
        vec3 multiply( vec3 s, vec3 d )
        {
            return s*d;
        }
        
        vec3 colorBurn( vec3 s, vec3 d )
        {
            return 1.0 - (1.0 - d) / s;
        }
        
        vec3 linearBurn( vec3 s, vec3 d )
        {
            return s + d - 1.0;
        }
        
        vec3 darkerColor( vec3 s, vec3 d )
        {
            return (s.x + s.y + s.z < d.x + d.y + d.z) ? s : d;
        }
        
        vec3 lighten( vec3 s, vec3 d )
        {
            return max(s,d);
        }
        
        vec3 screen( vec3 s, vec3 d )
        {
            return s + d - s * d;
        }
        
        vec3 colorDodge( vec3 s, vec3 d )
        {
            return d / (1.0 - s);
        }
        
        vec3 linearDodge( vec3 s, vec3 d )
        {
            return s + d;
        }
        
        vec3 lighterColor( vec3 s, vec3 d )
        {
            return (s.x + s.y + s.z > d.x + d.y + d.z) ? s : d;
        }
        
        float foverlay( float s, float d )
        {
            return (d < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);
        }
        
        vec3 overlay( vec3 s, vec3 d )
        {
            vec3 c;
            c.x = foverlay(s.x,d.x);
            c.y = foverlay(s.y,d.y);
            c.z = foverlay(s.z,d.z);
        
            return c;
        }
        
        float fsoftLight( float s, float d )
        {
            return (s < 0.5) ? d - (1.0 - 2.0 * s) * d * (1.0 - d)
                : (d < 0.25) ? d + (2.0 * s - 1.0) * d * ((16.0 * d - 12.0) * d + 3.0)
                : d + (2.0 * s - 1.0) * (sqrt(d) - d);
        }
        
        vec3 softLight( vec3 s, vec3 d )
        {
            vec3 c;
            c.x = fsoftLight(s.x,d.x);
            c.y = fsoftLight(s.y,d.y);
            c.z = fsoftLight(s.z,d.z);
        
            return c;
        }
        
        float fhardLight( float s, float d )
        {
            return (s < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);
        }
        
        vec3 hardLight( vec3 s, vec3 d )
        {
            vec3 c;
            c.x = fhardLight(s.x,d.x);
            c.y = fhardLight(s.y,d.y);
            c.z = fhardLight(s.z,d.z);
            return c;
        }
        
        float fvividLight( float s, float d )
        {
            return (s < 0.5) ? 1.0 - (1.0 - d) / (2.0 * s) : d / (2.0 * (1.0 - s));
        }
        
        vec3 vividLight( vec3 s, vec3 d )
        {
            vec3 c;
            c.x = fvividLight(s.x,d.x);
            c.y = fvividLight(s.y,d.y);
            c.z = fvividLight(s.z,d.z);
        
            return c;
        }
        
        vec3 linearLight( vec3 s, vec3 d )
        {
            return 2.0 * s + d - 1.0;
        }
        
        float fpinLight( float s, float d )
        {
            return (2.0 * s - 1.0 > d) ? 2.0 * s - 1.0 : (s < 0.5 * d) ? 2.0 * s : d;
        }
        
        vec3 pinLight( vec3 s, vec3 d )
        {
            vec3 c;
            c.x = fpinLight(s.x,d.x);
            c.y = fpinLight(s.y,d.y);
            c.z = fpinLight(s.z,d.z);
        
            return c;
        }
        
        vec3 hardMix( vec3 s, vec3 d )
        {
            return floor(s + d);
        }
        
        vec3 difference( vec3 s, vec3 d )
        {
            return abs(d - s);
        }
        
        vec3 exclusion( vec3 s, vec3 d )
        {
            return s + d - 2.0 * s * d;
        }
        
        vec3 subtract( vec3 s, vec3 d )
        {
            return s - d;
        }
        
        vec3 divide( vec3 s, vec3 d )
        {
            return s / d;
        }
        
        vec3 hue( vec3 s, vec3 d )
        {
            d = rgb2hsv(d);
            d.x = rgb2hsv(s).x;
            return hsv2rgb(d);
        }
        
        vec3 color( vec3 s, vec3 d )
        {
            s = rgb2hsv(s);
            s.z = rgb2hsv(d).z;
            return hsv2rgb(s);
        }
        
        vec3 saturation( vec3 s, vec3 d )
        {
            d = rgb2hsv(d);
            d.y = rgb2hsv(s).y;
            return hsv2rgb(d);
        }
        
        vec3 luminosity( vec3 s, vec3 d )
        {
            float dLum = dot(d, vec3(0.3, 0.59, 0.11));
            float sLum = dot(s, vec3(0.3, 0.59, 0.11));
            float lum = sLum - dLum;
            vec3 c = d + lum;
            float minC = min(min(c.x, c.y), c.z);
            float maxC = max(max(c.x, c.y), c.z);
            if(minC < 0.0) return sLum + ((c - sLum) * sLum) / (sLum - minC);
            else if(maxC > 1.0) return sLum + ((c - sLum) * (1.0 - sLum)) / (maxC - sLum);
            else return c;
        }
        
        vec3 add( vec3 s, vec3 d )
        {
            d.r /= 2.;
            d.g /= 2.;
            d.b /= 2.;
            s.r /= 2.;
            s.g /= 2.;
            s.b /= 2.;
            d += s;
        
            return d;
        }
        
        vec3 sampleXY(const int x, const int y, vec2 coord)
        {
            vec2 uv = (coord.xy + vec2(x, y)) / resolution;
        
            return texture2D(tDiffuse, uv).xyz;
        }
        
        vec3 operator(vec3 a, vec3 b, int operator) {
        
            if (operator == 0) {
                return overlay(a, b);
        
            } else if (operator == 1) {
                return screen(a, b);
        
            } else if (operator == 2) {
                return add(a, b);
        
            } else if (operator == 3) {
                return multiply(a, b);
        
            } else if (operator == 4) {
                return darken(a, b);
        
            } else if (operator == 5) {
                return lighten(a, b);
        
            } else if (operator == 6) {
                return colorDodge(a, b);
        
            } else if (operator == 7) {
                return colorBurn(a, b);
        
            } else if (operator == 8) {
                return hardLight(a, b);
        
            } else if (operator == 9) {
                return softLight(a, b);
        
            } else if (operator == 10) {
                return difference(a, b);
        
            } else if (operator == 11) {
                return exclusion(a, b);
        
            } else if (operator == 12) {
                return hue(a, b);
        
            } else if (operator == 13) {
                return saturation(a, b);
        
            } else if (operator == 14) {
                return color(a, b);
        
            } else if (operator == 15) {
                return luminosity(a, b);
            }
        
            return overlay(a, b);
        }
        
        void main()
        {
            float n = 4.0;
            int i = 0;
            int j = 0;
            vec3 m0 = vec3(0.0); vec3 m1 = vec3(0.0); vec3 m2 = vec3(0.0); vec3 m3 = vec3(0.0);
            vec3 s0 = vec3(0.0); vec3 s1 = vec3(0.0); vec3 s2 = vec3(0.0); vec3 s3 = vec3(0.0);
            vec3 c = texture2D(tDiffuse, vUv).rgb;

            vec2 q;
            vec2 r;

            vec3 hc =sampleXY(-1,-1,gl_FragCoord.xy) *  1.0 + sampleXY( 0,-1,gl_FragCoord.xy) *  2.0
                    +sampleXY( 1,-1,gl_FragCoord.xy) *  1.0 + sampleXY(-1, 1,gl_FragCoord.xy) * -1.0
                    +sampleXY( 0, 1,gl_FragCoord.xy) * -2.0 + sampleXY( 1, 1,gl_FragCoord.xy) * -1.0;

            vec3 vc =sampleXY(-1,-1,gl_FragCoord.xy) *  1.0 + sampleXY(-1, 0,gl_FragCoord.xy) *  2.0
                    +sampleXY(-1, 1,gl_FragCoord.xy) *  1.0 + sampleXY( 1,-1,gl_FragCoord.xy) * -1.0
                    +sampleXY( 1, 0,gl_FragCoord.xy) * -2.0 + sampleXY( 1, 1,gl_FragCoord.xy) * -1.0;

            vec3 c2 = sampleXY(0, 0,gl_FragCoord.xy);

            c2 -= pow(c2, lumi) * pow(dot(lumi, vc*vc + hc*hc), strength);

            m0 += c;
            s0 += c;

            m1 = m0;
            s1 = s0;

            m2 = m0;
            s2 = s0;

            m3 = m0;
            s3 = s0;

            vec3 result;
            float min_sigma2 = 1e+2;
            m0 /= n;
            s0 = abs(s0 / n - m0 * m0);

            float sigma2 = s0.r + s0.g + s0.b;
            if (sigma2 < min_sigma2) {
                min_sigma2 = sigma2;
                result = vec3(m0);
            }

            m1 /= n;
            s1 = abs(s1 / n - m1 * m1);

            sigma2 = s1.r + s1.g + s1.b;
            if (sigma2 < min_sigma2) {
                min_sigma2 = sigma2;
                result = vec3(m1);
            }

            m2 /= n;
            s2 = abs(s2 / n - m2 * m2);

            sigma2 = s2.r + s2.g + s2.b;
            if (sigma2 < min_sigma2) {
                min_sigma2 = sigma2;
                result = vec3(m2);
            }

            m3 /= n;
            s3 = abs(s3 / n - m3 * m3);

            sigma2 = s3.r + s3.g + s3.b;
            if (sigma2 < min_sigma2) {
                min_sigma2 = sigma2;
                result = vec3(m3);
            }

            vec3 res2 = vec3(operator(operator(result, c2, operator_two), result, operator_one));
            vec3 col3 = texture2D(tDiffuse, vUv).xyz;
            vec4 ocol = texture2D(tDiffuse, vUv);
            result = saturation(col3, res2);
            gl_FragColor = vec4(result + result, ocol.a);
        }
    `
};