HC.plugins.material_map = HC.plugins.material_map || {};
{
    HC.MaterialMapPlugin = class Plugin extends HC.AnimationPlugin {

        map;
        alphaMap;
        aoMap;
        bumpMap;
        bumpScale;
        displacementMap;
        displacementScale;
        displacementBias;
        emissiveMap;
        lightMap;
        metalnessMap;
        normalMap;
        roughnessMap;

        reset() {
            this.dispose();
            var keys = Object.getOwnPropertyNames(this);
            for (let k in keys) {
                this[keys[k]] = undefined;
            }
        }

        dispose() {
            var keys = Object.getOwnPropertyNames(this);
            for (let k in keys) {
                let v = this[keys[k]];
                if (v instanceof THREE.Texture) {
                    v.dispose();
                }
            }
        }
    }
}