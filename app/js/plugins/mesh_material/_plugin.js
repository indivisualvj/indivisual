HC.plugins.mesh_material = HC.plugins.mesh_material || {};
{
    HC.MeshMaterialPlugin = class Plugin extends HC.AnimationPlugin {

        /**
         * @type {THREE.Material}
         */
        material;

        before(geometry) {
            // do nothing until needed

            return geometry;
        }

        reset() {
            HC.traverse(this);
        }
    }
}
