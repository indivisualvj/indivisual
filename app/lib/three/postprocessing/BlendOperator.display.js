/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.BlendOperator = HC.BlendOperator || {};
HC.BlendOperator.display = {
    shader: `
        vec4 multiply( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                return s*d;

            } else if (s.a > 0.0) {
                return s;

            } else {
                return d;
            }
        }

        vec4 colorBurn( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                return 1.0 - (1.0 - d) / s;

            } else if (s.a > 0.0) {
                return s;

            } else {
                return d;
            }
        }

        vec4 linearBurn( vec4 s, vec4 d ) {
            return s + d - 1.0;
        }

        vec4 colorDodge( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                return d / (1.0 - s);

            } else if (s.a > 0.0) {
                return s;

            } else {
                return d;
            }

        }

        float fhardLight( float s, float d ) {
            return (s < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);
        }

        vec4 hardLight( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                vec4 c;
                c.x = fhardLight(s.x,d.x);
                c.y = fhardLight(s.y,d.y);
                c.z = fhardLight(s.z,d.z);
                c.a = max(s.a, d.a);
                return c;

            } else if (s.a > 0.0) {
                return s;

            } else {
                return d;
            }
        }

        float fvividLight( float s, float d ) {
            return (s < 0.5) ? 1.0 - (1.0 - d) / (2.0 * s) : d / (2.0 * (1.0 - s));
        }

        vec4 vividLight( vec4 s, vec4 d ) {
            vec4 c;
            c.x = fvividLight(s.x,d.x);
            c.y = fvividLight(s.y,d.y);
            c.z = fvividLight(s.z,d.z);

            return c;
        }

        float fpinLight( float s, float d ) {
            return (2.0 * s - 1.0 > d) ? 2.0 * s - 1.0 : (s < 0.5 * d) ? 2.0 * s : d;
        }

        vec4 pinLight( vec4 s, vec4 d ) {
            vec4 c;
            c.x = fpinLight(s.x,d.x);
            c.y = fpinLight(s.y,d.y);
            c.z = fpinLight(s.z,d.z);

            return c;
        }

        vec4 hardMix( vec4 s, vec4 d ) {
            return floor(s + d);
        }

        vec4 subtract( vec4 s, vec4 d ) {
           return s - d;
        }

        vec4 xor( vec4 s, vec4 d ) {
            if (s.a > 0.0 && d.a > 0.0) {
                return vec4(0.0);

            } else if (s.a > 0.0) {
                return s;

            } else {
                return d;
            }
        }

        vec4 sourceOver ( vec4 s, vec4 d ) {
            if (s.a > 0.0) {
                return s;
            }

            return d;
        }

        vec4 destinationOver ( vec4 s, vec4 d ) {
            if (d.a > 0.0) {
                return d;
            }

            return s;
        }

        vec4 sourceAtop( vec4 s, vec4 d ) {
            if (d.a > 0.0 && s.a > 0.0) {
                return s;
            }

            return d;
        }

        vec4 sourceIn( vec4 s, vec4 d ) {
            if (d.a > 0.0) {
                return s;
            }

            return vec4(0.0);
        }

        vec4 sourceOut( vec4 s, vec4 d ) {
            if (d.a == 0.0)
                return s;

            return vec4(0.0);
        }

        vec4 destinationAtop( vec4 s, vec4 d ) {
            if (d.a > 0.0 && s.a > 0.0) {
                return d;
            }

            return s;
        }

        vec4 destinationIn( vec4 s, vec4 d ) {
            if (s.a > 0.0) {
                return d;
            }

            return vec4(0.0);
        }

        vec4 destinationOut( vec4 s, vec4 d ) {
            if (s.a == 0.0)
                return d;

            return vec4(0.0);
        }

        vec4 add( vec4 s, vec4 d ) {
            s.a /= 2.;
            d.a /= 2.;

            return d+s;
        }

        vec4 operator(vec4 a, vec4 b, int operator) {

            if (operator == 0) {
                return b;

            } else if (operator == 1) {
                return sourceAtop(a, b);

            } else if (operator == 2) {
                return sourceIn(a, b);

            } else if (operator == 3) {
                return sourceOut(a, b);

            } else if (operator == 4) {
                return destinationOver(a, b);

            } else if (operator == 5) {
                return destinationAtop(a, b);

            } else if (operator == 6) {
                return destinationIn(a, b);

            } else if (operator == 7) {
                return destinationOut(a, b);

            } else if (operator == 8) {
                return xor(a, b);

            } else if (operator == 9) {
                return multiply(a, b);

            } else if (operator == 10) {
                return difference(a, b);

            } else if (operator == 11) {
                return colorDodge(a, b);

            } else if (operator == 12) {
                return colorBurn(a, b);

            } else if (operator == 13) {
                return hardLight(a, b);

            } else if (operator == 14) {
                return add(a, b);
                
            } else if (operator == 15) {
                return sourceOver(a, b);
            }
            
            return sourceOver(a, b);
        }
    `,
};