/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationTexturePlugin} from "../AnimationTexturePlugin";

class OverrideMaterialInputPlugin extends AnimationTexturePlugin
{

    clip;

    /**
     * @type {CanvasRenderingContext2D}
     */
    context;

    /**
     * @type {OffscreenCanvas}
     */
    canvas;

    /**
     *
     * @type {boolean}
     */
    enableCropping = true;

    properties = {
        map: null,
        emissiveMap: null
    };

    setCropping(cropping) {
        this.enableCropping = cropping;
    }

    reset() {
        this.context = null;
        this.clip = null;
        this._dispose();
    }

    _dispose() {
        let keys = Object.keys(this.properties);
        for (let k in keys) {
            let v = this.properties[keys[k]];
            this.properties[keys[k]] = undefined;
            HC.traverse(v);
        }
    }
}

export {OverrideMaterialInputPlugin};
