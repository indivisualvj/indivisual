/**
 *
 * @param obj
 */
function threeDispose(obj) {
    if (!(obj instanceof THREE.Scene) && obj.dispose) {
        obj.dispose();
    }
    if (obj.renderTarget) {
        obj.renderTarget.dispose();
    }
    if (obj.material) {
        obj.material.dispose();

        let keys = Object.keys(obj.material);
        for(let k in keys) {
            let key = keys[k];
            if (obj.material[key] instanceof THREE.Texture) {
                console.log('material texture dispose')
                obj.material[key].dispose();
            }
        }
    }
    if (obj.geometry) {
        obj.geometry.dispose();
    }
}
