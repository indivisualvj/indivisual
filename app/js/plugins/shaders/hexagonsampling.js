{
    HC.plugins.shaders.hexagonsampling = class Plugin extends HC.ShaderPlugin {
        static index = 230;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            divisor: {
                value: 80,
                _type: [1, 500, 0.5],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }

        /**
         * @author alteredq / http://alteredqualia.com/
         *
         * Full-screen textured quad shader
         */

        shader = {

            uniforms: {

                "tDiffuse": { type: "t", value: null },
                "divisor": {type: 'f', value: 80},
                "resolution": { type: "v2", value: new THREE.Vector2( 800, 600) }

            },

            vertexShader: [

                "varying vec2 vUv;",

                "void main() {",

                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                "}"

            ].join( "\n" ),

            fragmentShader: [

                "uniform sampler2D tDiffuse;",
                "uniform vec2 resolution;",
                "uniform float divisor;",

                "const float PI = 3.14159265359;",
                "const float TAU = 2.0*PI;",
                "const float deg30 = TAU/12.0;",

                "float hexDist(vec2 a, vec2 b){",
                "    vec2 p = abs(b-a);",
                "    float s = sin(deg30);",
                "    float c = cos(deg30);",

                "    float diagDist = s*p.x + c*p.y;",
                "    return max(diagDist, p.x)/c;",
                "}",

                "vec2 nearestHex(float s, vec2 st){",
                "    float h = sin(deg30)*s;",
                "    float r = cos(deg30)*s;",
                "    float b = s + 2.0*h;",
                "    float a = 2.0*r;",
                "    float m = h/r;",

                "    vec2 sect = st/vec2(2.0*r, h+s);",
                "    vec2 sectPxl = mod(st, vec2(2.0*r, h+s));",

                "    float aSection = mod(floor(sect.y), 2.0);",

                "    vec2 coord = floor(sect);",
                "    if(aSection > 0.0){",
                "        if(sectPxl.y < (h-sectPxl.x*m)){",
                "            coord -= 1.0;",
                "        }",
                "        else if(sectPxl.y < (-h + sectPxl.x*m)){",
                "            coord.y -= 1.0;",
                "        }",

                "    }",
                "    else{",
                "        if(sectPxl.x > r){",
                "            if(sectPxl.y < (2.0*h - sectPxl.x * m)){",
                "                coord.y -= 1.0;",
                "            }",
                "        }",
                "        else{",
                "            if(sectPxl.y < (sectPxl.x*m)){",
                "                coord.y -= 1.0;",
                "            }",
                "            else{",
                "                coord.x -= 1.0;",
                "            }",
                "        }",
                "    }",

                "    float xoff = mod(coord.y, 2.0)*r;",
                "    return vec2(coord.x*2.0*r-xoff, coord.y*(h+s))+vec2(r*2.0, s);",
                "}",

                "void main(){",
                "    float s = resolution.x/divisor;",
                "    vec2 nearest = nearestHex(s, gl_FragCoord.xy);",
                "    vec4 texel = texture2D(tDiffuse, nearest/resolution.xy, -100.0);",
                "    float dist = hexDist(gl_FragCoord.xy, nearest);",

                "    float luminance = (texel.r + texel.g + texel.b)/3.0;",
                "    //float interiorSize = luminance*s;",
                "    float interiorSize = s;",
                "    float interior = 1.0 - smoothstep(interiorSize-1.0, interiorSize, dist);",
                "    //gl_FragColor = vec4(dist);",
                "    vec4 col = vec4(texel.rgb*interior, 1.0);",
                "    if (col.r == 0.0 && col.g == 0.0 && col.b == 0.0) {",
                "        col.a = 0.0;",
                "    }",
                "    gl_FragColor = col;",
                "    //gl_FragColor = vec4(nearest, 0.0, 1.0);",
                "}"

            ].join( "\n" )

        }
    }
}
