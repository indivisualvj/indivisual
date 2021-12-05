{
    HC.plugins.shaders.paint = class Plugin extends HC.ShaderPlugin {
        static index = 130;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(this.shader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            colorOffset: {
                value: 0.95,
                _type: [0, 2, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            colorFactor: {
                value: 0,
                _type: [0, 2, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            sampleDistance: {
                value: 0.54,
                _type: [-10, 10, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            waveFactor: {
                value: 0.00127,
                _type: [0, 0.5, 0.0001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        };

        /**
         * copy of something found on https://www.shadertoy.com/
         */
        shader = {
            uniforms: {
                "tDiffuse": { type: "t", value: null },
                "resolution": { type: "v2", value: new THREE.Vector2( 800, 600) },
                "colorOffset": { type: "f", value: 0.95 },
                "colorFactor": { type: "f", value: 0 },
                "sampleDistance": { type: "f", value: 0.54 },
                "waveFactor": { type: "f", value: 0.00127 }
            },

            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = vec2( uv.x, uv.y );
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`
            ,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                uniform vec2 resolution;
                uniform float colorOffset;
                uniform float colorFactor;
                uniform float sampleDistance;
                uniform float waveFactor;
        
                void main() {
                    vec4 color, org, tmp, add;
                    float sample_dist, f;
                    vec2 vin;
                    vec2 uv = vUv;
            
                    add = color = org = texture2D( tDiffuse, uv );
            
                    vin = (uv - vec2(0.5)) * vec2( .75 /*vingenettingOffset * 2.0*/);
                    sample_dist =(dot( vin, vin ) * 2.0);
            
                    f = (waveFactor * 100.0 + sample_dist) * sampleDistance * 4.0;
            
                    vec2 sampleSize = vec2(  1.0 / resolution.x, 1.0 / resolution.y ) * vec2(f);
            
                    add += tmp = texture2D( tDiffuse, uv + vec2(0.111964, 0.993712) * sampleSize);
                    if( tmp.b < color.b ) color = tmp;
            
                    add += tmp = texture2D( tDiffuse, uv + vec2(0.846724, 0.532032) * sampleSize);
                    if( tmp.b < color.b ) color = tmp;
            
                    add += tmp = texture2D( tDiffuse, uv + vec2(0.943883, -0.330279) * sampleSize);
                    if( tmp.b < color.b ) color = tmp;
            
                    add += tmp = texture2D( tDiffuse, uv + vec2(0.330279, -0.943883) * sampleSize);
                    if( tmp.b < color.b ) color = tmp;
            
                    add += tmp = texture2D( tDiffuse, uv + vec2(-0.532032, -0.846724) * sampleSize);
                    if( tmp.b < color.b ) color = tmp;
            
                    add += tmp = texture2D( tDiffuse, uv + vec2(-0.993712, -0.111964) * sampleSize);
                    if( tmp.b < color.b ) color = tmp;
            
                    add += tmp = texture2D( tDiffuse, uv + vec2(-0.707107, 0.707107) * sampleSize);
                    if( tmp.b < color.b ) color = tmp;
            
                    uv = (uv - vec2(0.5));// * vec2( vingenettingOffset );
                    color = color * vec4(2.0) - (add / vec4(8.0));
                    color = color + (add / vec4(8.0) - color) * (vec4(1.0) - vec4(sample_dist * 0.5));
                    //color = color + (add / vec4(8.0) - color) * (-vec4(sample_dist * 0.5));
                    color = vec4( mix(color.rgb * color.rgb * vec3(colorOffset) + color.rgb, color.ggg * colorFactor/* - vec3( vingenettingDarkening )*/, vec3( dot( uv, uv ))), 1.0 );
                    if (color.r == .0 && color.g == .0 && color.b == .0) {
                       color.a = .0;
                    }
                    gl_FragColor = color;
                }`
        }
    }
}
