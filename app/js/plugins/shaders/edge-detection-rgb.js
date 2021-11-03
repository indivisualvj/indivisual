{
    HC.plugins.shaders.edge_detection_rgb = class Plugin extends HC.ShaderPlugin {
        static index = 145;
        static name = 'edge-detection-rgb';
        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            opacity: {
                value: 0.75,
                _type: [0, 1, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
        };

        shader = {
            uniforms: {
                "tDiffuse": { type: "t", value: null },
                "resolution":    { type: "v2", value: new THREE.Vector2( 512, 512 ) },
                "opacity": { type: "f", value: 1.0 }
            },

            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = vec2( uv.x, uv.y );
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`
            ,

            fragmentShader: `
                uniform vec2 resolution;
                varying vec2 vUv;
                uniform float opacity;
                uniform sampler2D tDiffuse;
                
                void mainImage( out vec4 fragColor, in vec2 fragCoord )
                {
                    vec2 uv = fragCoord.xy;
                    
                    fragColor = texture(tDiffuse, fragCoord) * 1.0-opacity;
                    
                    vec3 TL = texture(tDiffuse, uv + vec2(-1, 1) / resolution.xy).rgb;
                    vec3 TM = texture(tDiffuse, uv + vec2(0, 1) / resolution.xy).rgb;
                    vec3 TR = texture(tDiffuse, uv + vec2(1, 1) / resolution.xy).rgb;
                    
                    vec3 ML = texture(tDiffuse, uv + vec2(-1, 0) / resolution.xy).rgb;
                    vec3 MR = texture(tDiffuse, uv + vec2(1, 0) / resolution.xy).rgb;
                    
                    vec3 BL = texture(tDiffuse, uv + vec2(-1, -1) / resolution.xy).rgb;
                    vec3 BM = texture(tDiffuse, uv + vec2(0, -1) / resolution.xy).rgb;
                    vec3 BR = texture(tDiffuse, uv + vec2(1, -1) / resolution.xy).rgb;
                                         
                    vec3 GradX = -TL + TR - 2.0 * ML + 2.0 * MR - BL + BR;
                    vec3 GradY = TL + 2.0 * TM + TR - BL - 2.0 * BM - BR;
                    
                    
                   /* vec2 gradCombo = vec2(GradX.r, GradY.r) + vec2(GradX.g, GradY.g) + vec2(GradX.b, GradY.b);
                    
                    fragColor = vec4(gradCombo.r, gradCombo.g, 0, 1);*/
                    
                    fragColor.r = fragColor.r + length(vec2(GradX.r, GradY.r));
                    fragColor.g = fragColor.g + length(vec2(GradX.g, GradY.g));
                    fragColor.b = fragColor.b + length(vec2(GradX.b, GradY.b));
                }
                
                void main() {
                    mainImage(gl_FragColor, vUv);
                }
            `
        }
    };
}
