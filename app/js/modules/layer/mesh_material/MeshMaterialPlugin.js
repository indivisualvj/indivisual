/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class MeshMaterialPlugin extends HC.AnimationPlugin {

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

export {MeshMaterialPlugin};
