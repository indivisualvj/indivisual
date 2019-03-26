HC.plugins.material_map = HC.plugins.material_map || {};
{
    HC.MaterialMapPlugin = class Plugin extends HC.AnimationPlugin {

        map;
        emissiveMap;

        reset() {
            this.dispose();
            if (this.map) {
                this.map = undefined;
            }
            if (this.emissiveMap) {
                this.emissiveMap = undefined;
            }
        }

        dispose() {
            if (this.map) {
                this.map.dispose();
            }
            if (this.emissiveMap) {
                this.emissiveMap.dispose();
            }
        }
    }
}