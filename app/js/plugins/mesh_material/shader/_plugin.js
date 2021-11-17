/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.MeshShaderMaterialPlugin = class MeshShaderMaterialPlugin extends HC.MeshMaterialPlugin {
// todo add opacity to all shader based materials
        static index = 99;
        active = false;

        apply(geometry, index) {
            this.active = true;
            let material = new THREE.ShaderMaterial(this.shader);
            material.color = new THREE.Color();
            this.material = material;

            let mesh = new THREE.Mesh(geometry, this.material);
            this.mesh = mesh;

            mesh.onBeforeRender = () => {
                if (this.layer.isVisible() && material.uniforms) {
                    if (material.uniforms.uTime) {
                        material.uniforms.uTime.value = this.layer.getOscillatePlugin('timestamp').apply({value: 1});
                    }
                    if (material.uniforms.uColor) {
                        let color = this.layer.materialColor;
                        let sc = this.layer.shapeColor(false);
                        material.uniforms.uColor.value = new THREE.Color(color || sc);
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
            threeTraverse(this);
        }
    }
}
