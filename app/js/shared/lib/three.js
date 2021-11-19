HC = HC || {};

/**
 *
 * @param obj
 */
HC.dispose = function (obj) {
    let disposable;

    if (obj instanceof THREE.Scene) {
        return;
    }

    if (obj.dispose) {
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
                obj.material[key].dispose();
            }
        }
    }
    if (obj.geometry) {
        disposable = obj.geometry;
    }

    if (disposable) {
        disposable.dispose();
    }
}

HC.traverse = function (obj) {
    if (!isObject(obj)) return;

    if (obj.dispose && typeof obj.dispose === 'function') {
        console.log(obj.constructor.name, 'dispose');
        obj.dispose();
    }
    if (obj.traverse && typeof obj.traverse === 'function') {
        console.log(obj.constructor.name, 'traverse');
        obj.traverse(HC.traverse);
    }

    let keys = Object.keys(obj);

    for (let k in keys) {
        let key = keys[k];
        let prop = obj[key];
        if (prop) {
            if (prop.traverse && typeof prop.traverse === 'function') {
                prop.traverse(HC.dispose);

            } else if (prop.dispose && typeof prop.dispose === 'function') {
                console.log(prop.constructor.name, 'dispose', key);
                prop.dispose();
            }
        }
    }
}
