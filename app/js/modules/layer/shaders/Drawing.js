/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShaderPlugin} from "../ShaderPlugin";

class drawing extends ShaderPlugin {
    static index = 140;
    static settings = {
        apply: false,
        random: false,
        onebit: {value: false},
        intensity: {
            value: 8,
            _type: [2, 16, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        radius: {
            value: 2.0,
            _type: [1., 16, .25],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
    }
    /**
     * @author alteredq / http://alteredqualia.com/
     *
     * Full-screen textured quad shader
     */
    shader = {

        uniforms: {

            "tDiffuse": {type: "t", value: null},
            "onebit": {type: "1i", value: 1},
            "intensity": {type: "1i", value: 8},
            "radius": {type: "f", value: 2.0},
            "resolution": {type: "v2", value: new THREE.Vector2(800, 600)}

        },

        vertexShader: `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`,
        fragmentShader: `
                varying vec2 vUv;
        
                uniform sampler2D tDiffuse;
                uniform vec2 resolution;
                uniform bool onebit;
                uniform float radius;
                uniform int intensity;
                
                void main(void)
                {
                    float power_radius = radius * radius;
                    vec2 uv = gl_FragCoord.xy / resolution.xy;
                    int intensity_count[16];
                    // cleanup
                    for (int i = 0; i < intensity; ++i) {
                        intensity_count[i] = 0;
                    }
                
                    // step 1
                    // for each pixel within radius of a pixel
                    for (float x = -radius; x < radius; ++x) {
                        for (float y = -radius; y < radius; ++y) {
                            vec2 abs_pos = vec2(x, y);
                            if (power_radius < dot(abs_pos, abs_pos))
                                continue;
                            vec2 pos = (abs_pos / resolution.xy) + uv;
                            vec4 col_element = texture2D(tDiffuse, pos);
                            int current_intensity = int(
                                (dot(col_element, vec4(1.0, 1.0, 1.0, 0.0)) / 3.0) *
                                float(intensity)
                            );
                            current_intensity = (current_intensity >= intensity) ?
                            intensity - 1 :
                                current_intensity;
                            for (int i = 0; i < intensity; ++i) {
                                if (i == current_intensity) {
                                    intensity_count[i] += 1;
                                    break;
                                }
                            }
                        }
                    }
                    // step 2
                    // find the maximum intensity
                    int max_level = 0;
                    float val = 0.0;
                    vec4 col_out = vec4(0.0, 0.0, 0.0, 1.0);
                    for (int level = 0; level < intensity; ++level) {
                        if (intensity_count[level] > max_level) {
                            max_level = intensity_count[level];
                            val = float(max_level) / (3.14 * power_radius);
                            col_out = vec4(val, val, val, 1.0);
                        }
                    }
                    // step 3
                    // write the final color
                    col_out.r = step(0.2, 1.0 - col_out.r);
                    col_out.g = step(0.2, 1.0 - col_out.g);
                    col_out.b = step(0.2, 1.0 - col_out.b);
                
                    if (!onebit) {
                        vec4 col = texture2D(tDiffuse, vUv);
                        if (col_out.r > 0.0) {
                            col_out.r = col.r;
                        }
                        if (col_out.g > 0.0) {
                            col_out.g = col.g;
                        }
                        if (col_out.b > 0.0) {
                            col_out.b = col.b;
                        }
                    }
                
                    if (col_out.r == 0.0 && col_out.g == 0.0 && col_out.b == 0.0) {
                        col_out.a = 0.0;
                    }
                
                    gl_FragColor = col_out;
                }
            `
    }

    create() {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(this.shader);
        }

        return this.pass;
    }
}

export {drawing};
