// fragmentShader by https://www.shadertoy.com/view/tldXR7
import {MeshShaderMaterialPlugin} from "../MeshShaderMaterialPlugin";

class parallel extends MeshShaderMaterialPlugin {

        shader = {
            uniforms: {
                uTime: { type: 'f', value: 1.0 },
                opacity: { type: 'f', value: 1.0 },
                uColor: { type: 'v3', value: { r: 1.0, g: 1.0, b: 1.0 } }
            },
            fragmentShader: MeshShaderMaterialPlugin.fragmentPrefix + `
                uniform vec3 uColor;
                
                void main () {
                    float time = uTime/500.0;
                    float w = iResolution.x / 5.;
                    float h = iResolution.y / 6.;
                
                    float j = mod(vUv.y / h, 4.);
                
                    float xPos = vUv.x;
                    if (j > 3.)
                        xPos -= 20.*sin(time);
                    else if (j > 2.)
                        xPos -= 20.*cos(time);
                    else if (j > 1.)
                        xPos -= 10.*(time);
                    else
                        xPos += 10.*time;
                    
                    float i = mod(floor(xPos / w), 2.);
                
                    gl_FragColor = vec4(uColor, 1.);
                    if (i >= 1.0) {
                        gl_FragColor = vec4(0);
                    }
                
                    float ij = mod(vUv.y, h);
                    if (ij < 1.)
                        if (i >= 1.)
                            gl_FragColor = vec4(uColor, opacity);
                        else
                            gl_FragColor = vec4(0);
                }
            `
            ,
            vertexShader: MeshShaderMaterialPlugin.vertexShader
        }
    }

export {parallel};
