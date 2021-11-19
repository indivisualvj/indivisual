HC.plugins.override_material_input = HC.plugins.override_material_input || {};
{
    HC.OverrideMaterialInputPlugin = class Plugin extends HC.AnimationTexturePlugin {

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
}
