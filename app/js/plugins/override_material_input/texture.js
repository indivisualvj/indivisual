/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.plugins.override_material_input.texture = class Plugin extends HC.OverrideMaterialInputPlugin {

        file;
        loading = undefined;

        properties = {
            map: null,
            emissiveMap: null,
            alphaMap: null,
            aoMap: null,
            bumpMap: null,
            bumpScale: null,
            displacementMap: null,
            displacementScale: null,
            displacementBias: null,
            lightMap: null,
            metalnessMap: null,
            normalMap: null,
            roughnessMap: null
        };

        apply(file) {
//fixme:
            // file = AssetManager.getImage(file);

            if (this.properties.map && this.file !== file) {
                this.reset();
            }

            if (!this.loading && !this.properties.map) {
                if (file) {
                    let inst = this;
                    let path = HC.filePath(IMAGE_DIR, file);
                    this.loading = true;

                    //fixme:
                    // AssetManager.loadMaterialMap(this.properties, path, function (mat) {
                    //     inst.file = file;
                    //     inst.loading = false;
                    //
                    //     if (!mat.emissiveMap) {
                    //         inst.properties.emissiveMap = mat.map;
                    //     }
                    //
                    // }, this.reset);

                }
            }

            return '';
        }

        after() {
            if (this.properties && this.properties.map) {
                let map;
                if ((map = this.properties.map)) {
                    this.updateTexture(map, 'material');
                }
                if ((map = this.properties.aoMap)) {
                    this.updateTexture(map, 'material');
                }
                if ((map = this.properties.emissiveMap)) {
                    this.updateTexture(map, 'material');
                }
                if ((map = this.properties.alphaMap)) {
                    this.updateTexture(map, 'material');
                }
                if ((map = this.properties.bumpMap)) {
                    this.updateTexture(map, 'material');
                }
                if ((map = this.properties.displacementMap)) {
                    this.updateTexture(map, 'material');
                }
                if ((map = this.properties.lightMap)) {
                    this.updateTexture(map, 'material');
                }
                if ((map = this.properties.metalnessMap)) {
                    this.updateTexture(map, 'material');
                }
                if ((map = this.properties.normalMap)) {
                    this.updateTexture(map, 'material');
                }
                if ((map = this.properties.roughnessMap)) {
                    this.updateTexture(map, 'material');
                }
            }
        }
    }
}
