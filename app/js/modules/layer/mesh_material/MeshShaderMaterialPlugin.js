/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "./MeshMaterialPlugin";
import * as HC from '../../../shared/Three';
import {Color, Mesh, ShaderMaterial} from "three";

class MeshShaderMaterialPlugin extends MeshMaterialPlugin {
    static index = 99;
    static standardUniforms = {
        uTime: {type: 'f', value: 1.0},
        opacity: {type: 'f', value: 1.0},
    };
    static fragmentPrefix = `
        uniform float uTime;
        uniform float opacity;
        varying vec2 vUv;
        vec2 resolution = vec2(1.0);
        vec2 iResolution = vec2(1.0);
    `;
    static fragmentSuffix = `
        void main() {
            mainImage(gl_FragColor, vUv);
            gl_FragColor.a *= opacity;
        }
    `;
    static vertexShader = "varying vec2 vUv;void main(){vUv = uv;vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_Position = projectionMatrix * mvPosition;}";
    active = false;

    apply(geometry, index) {
        this.active = true;
        let material = new ShaderMaterial(this.shader);
        material.color = new Color();
        this.material = material;

        let mesh = new Mesh(geometry, this.material);
        this.mesh = mesh;

        mesh.onBeforeRender = () => {
            if (this.layer.isVisible() && material.uniforms) {
                if (material.uniforms.uTime) {
                    material.uniforms.uTime.value = this.layer.getOscillatePlugin('timestamp').apply({value: 1});
                }
                if (material.uniforms.uColor) {
                    let color = this.layer.materialColor;
                    let sc = this.layer.shapeColor(false);
                    material.uniforms.uColor.value = new Color(color || sc);
                }
                if (material.uniforms.audio) {
                    material.uniforms.audio.value = this.audioAnalyser.getFrequencyRangeValues();
                }
                if (material.uniforms.opacity) {
                    material.uniforms.opacity.value = material.opacity;
                }
            }

        };

        return mesh;
    }

    reset() {
        HC.traverse(this);
    }
}

export {MeshShaderMaterialPlugin};
