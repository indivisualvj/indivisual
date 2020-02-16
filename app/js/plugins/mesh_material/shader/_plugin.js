/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.MeshShaderMaterialPlugin = class MeshShaderMaterialPlugin extends HC.MeshMaterialPlugin {

        static index = 99;
        active = false;

        apply(geometry, index) {
            this.active = true;
            let material = new THREE.ShaderMaterial(this.shader);
            material.color = new THREE.Color();

            let inst = this;
            this.animation.listener.register(EVENT_RENDERER_RENDER, this.id(index), function (renderer) {
                if (inst.layer.isVisible() && material.uniforms) {
                    if (material.uniforms.uTime) {
                        material.uniforms.uTime.value = inst.layer.getOscillatePlugin('timestamp').apply({value: 1});
                    }
                    if (material.uniforms.uColor) {
                        let color = inst.layer.materialColor;
                        let sc = inst.layer.shapeColor(false);
                        material.uniforms.uColor.value = new THREE.Color(color || sc);
                    }
                }

            });

            return new THREE.Mesh(geometry, material);
        }

        reset() {
            if (this.active) {
                this.active = false;
                this.animation.listener.removeLike(this.id());
            }
        }
    }
}
