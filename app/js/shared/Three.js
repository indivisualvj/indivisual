import {Scene, Texture} from "three";

/**
 *
 * @param obj
 */

const dispose = function (obj) {
    let disposable;

    if (obj instanceof Scene) {
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
            if (obj.material[key] instanceof Texture) {
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

const traverse = function (obj) {
    if (!isObject(obj)) return;

    if (obj.dispose && typeof obj.dispose === 'function') {
        obj.dispose();
    }
    if (obj.traverse && typeof obj.traverse === 'function') {
        obj.traverse(HC.traverse);
    }

    let keys = Object.keys(obj);

    for (let k in keys) {
        let key = keys[k];
        let prop = obj[key];
        if (prop) {
            if (prop.traverse && typeof prop.traverse === 'function') {
                prop.traverse(dispose);

            } else if (prop.dispose && typeof prop.dispose === 'function') {
                prop.dispose();
            }
        }
    }
}

export {dispose, traverse};
