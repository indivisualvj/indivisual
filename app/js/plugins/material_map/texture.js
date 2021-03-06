/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.plugins.material_map.texture = class Plugin extends HC.MaterialMapPlugin {

        file;
        loading;

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

            file = assetman.getImage(file);

            if (this.properties.map && this.file != file) {
                this.reset();
            }

            if (!this.loading && !this.properties.map) {
                if (file) {
                    let inst = this;
                    let path = filePath(IMAGE_DIR, file);
                    this.loading = true;

                    assetman.loadMaterialMap(this.properties, path, function (mat) {
                        inst.file = file;
                        inst.loading = false;

                        if (!mat.emissiveMap) {
                            inst.properties.emissiveMap = mat.map;
                        }

                    }, this.reset);

                }
                // else {
                //     this.reset();
                // }
            }

            return '';
        }

        after() {
            if (this.properties && this.properties.map) {
                let map = this.properties.map;
                this.updateTexture(map, 'material');
            }
        }
    }
}