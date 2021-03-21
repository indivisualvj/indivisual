{
    HC.plugins.shaders.sobel_filter = class Plugin extends HC.ShaderPlugin {
        static index = 145;
        static name = 'sobel-filter';
        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false
        };

        shader = {
            uniforms: {

                "tDiffuse": { type: "t", value: null },
                "resolution":    { type: "v2", value: new THREE.Vector2( 512, 512 ) },
            },

            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = vec2( uv.x, uv.y );
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`
            ,

            fragmentShader: [

                "uniform sampler2D tDiffuse;",
                "varying vec2 vUv;",
                "uniform vec2 resolution;",
                "vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);",

                "mat3 G[2];",

                "const mat3 g0 = mat3( 1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0 );",
                "const mat3 g1 = mat3( 1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0 );",


                "void main(void)",
                "{",
                "mat3 I;",
                "float cnv[2];",
                "vec3 sample;",

                "G[0] = g0;",
                "G[1] = g1;",

                /* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
                "for (float i=0.0; i<3.0; i++)",
                "for (float j=0.0; j<3.0; j++) {",
                "sample = texture2D( tDiffuse, vUv + texel * vec2(i-1.0,j-1.0) ).rgb;",
                "I[int(i)][int(j)] = length(sample);",
                "}",

                /* calculate the convolution values for all the masks */
                "for (int i=0; i<2; i++) {",
                "float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);",
                "cnv[i] = dp3 * dp3; ",
                "}",

                "gl_FragColor = vec4(0.5 * sqrt(cnv[0]*cnv[0]+cnv[1]*cnv[1]));",
                "} ",

            ].join( "\n" )
        }
    };
}
