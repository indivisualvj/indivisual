/**
 * todo THREE.traverseDispose o.ä.
 * @param obj
 */
function threeDispose(obj) {
    if (obj.dispose) {
        obj.dispose();
    }
    if (obj.material) {
        obj.material.dispose();

        var keys = Object.keys(obj.material);
        for(let k in keys) {
            let key = keys[k];
            if (obj.material[key] instanceof THREE.Texture) {
                obj.material[key].dispose();
            }
        }
    }
    if (obj.geometry) {
        obj.geometry.dispose();
    }
}