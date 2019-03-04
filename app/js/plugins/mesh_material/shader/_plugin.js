{
    HC.MeshShaderMaterialPlugin = class MeshShaderMaterialPlugin extends HC.MeshMaterialPlugin {
        apply(geometry) {
            let material = new THREE.ShaderMaterial(this.shader);
            material.color = new THREE.Color();

            let inst = this;
            listener.register('renderer.render', this.id(), function (target) {
                if (material.uniforms && material.uniforms.uTime) {
                    material.uniforms.uTime.value = inst.layer.getOscillatePlugin('timestamp').apply({value: 1});
                }
            });

            return new THREE.Mesh(geometry, material);
        }

        dispose() {
            listener.removeId(this.id()); // fixme stops uTime update when fullreset called after reload when meshshadermatplugin loaded
        }
    }
}