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
            listener.register('renderer.render', this.id(index), function (renderer) {
                if (material.uniforms && material.uniforms.uTime) {
                    material.uniforms.uTime.value = inst.layer.getOscillatePlugin('timestamp').apply({value: 1});
                }
            });

            return new THREE.Mesh(geometry, material);
        }

        reset() {
            if (this.active) {
                this.active = false;
                listener.removeLike(this.id());
            }
        }
    }
}