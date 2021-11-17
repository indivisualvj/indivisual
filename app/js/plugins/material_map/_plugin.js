HC.plugins.material_map = HC.plugins.material_map || {};
{
    HC.MaterialMapPlugin = class Plugin extends HC.AnimationTexturePlugin {

        properties = {
            map: null,
            emissiveMap: null
        };

        reset() {
            this._dispose();
        }

        _dispose() {
            let keys = Object.keys(this.properties);
            for (let k in keys) {
                let v = this.properties[keys[k]];
                this.properties[keys[k]] = undefined;
                threeTraverse(v);
            }
        }
    }
}
