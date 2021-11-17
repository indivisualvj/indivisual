/**
 *
 * @param obj
 */
function threeDispose(obj) {
    let disposable;
    if (!(obj instanceof THREE.Scene) && obj.dispose) { // fixme: not avoid disposing scenes. get control over it! ;)
        disposable = obj;
    }
    if (obj.renderTarget) {
        disposable = obj.renderTarget;
    }
    if (obj.material) {
        disposable = obj.material;

        let keys = Object.keys(obj.material);
        for (let k in keys) {
            let key = keys[k];
            if (obj.material[key] instanceof THREE.Texture) {
                requestAnimationFrame(() => {
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
            disposable.dispose();
        });
    }
}

function threeTraverse(obj) {
    // if (!isObject(obj)) return;
    //
    // if (obj.dispose && typeof obj.dispose === 'function') {
    //     console.log(obj.constructor.name, 'dispose');
    //     obj.dispose();
    // }
    // if (obj.traverse && typeof obj.traverse === 'function') {
    //     console.log(obj.constructor.name, 'traverse');
    //     obj.traverse(threeTraverse);
    // }
    //
    // let keys = Object.keys(obj);
    //
    // for (let k in keys) {
    //     let key = keys[k];
    //     let prop = obj[key];
    //     if (prop) {
    //         if (prop.traverse && typeof prop.traverse === 'function') {
    //             prop.traverse(threeTraverse);
    //
    //         } else if (prop.dispose && typeof prop.dispose === 'function') {
    //             console.log(prop.constructor.name, 'dispose', key);
    //             prop.dispose();
    //         }
    //     }
    // }
}
