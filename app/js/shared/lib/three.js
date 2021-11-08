/**
 *
 * @param obj
 */
function threeDispose(obj) {
    let disposable;
    if (!(obj instanceof THREE.Scene) && obj.dispose) {
        disposable = obj;
    }
    if (obj.renderTarget) {
        disposable = obj.renderTarget;
    }
    if (obj.material) {
        disposable = obj.material;

        let keys = Object.keys(obj.material);
        for(let k in keys) {
            let key = keys[k];
            if (obj.material[key] instanceof THREE.Texture) {
                requestAnimationFrame(() => {
                    // console.log('material texture dispose', obj.material[key].uuid);
                    obj.material[key].dispose();
                });
            }
        }
    }
    if (obj.geometry) {
        disposable = obj.geometry;
    }

    if (disposable) {
        requestAnimationFrame(() => {
            // console.log('dispose', disposable.uuid);
            disposable.dispose();
        });
    }
}
