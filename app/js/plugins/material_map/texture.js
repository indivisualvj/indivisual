{
    HC.plugins.material_map.texture = class Plugin extends HC.MaterialMapPlugin {

        file;
        loading;

        apply(file) {

            file = assetman.getImage(file);

            if (this.map && this.file != file) {
                this.reset();
            }

            if (!this.loading && !this.map) {

                if (file) {
                    let inst = this;
                    let path = filePath(IMAGE_DIR, file);
                    this.loading = true;

                    // complex
                    if (file.match(/.+\.mat/i)) {
                        assetman.loadMaterial(path, function (mat) {
                            var keys = Object.getOwnPropertyNames(inst);
                            for (let k in keys) {
                                let key = keys[k]
                                if (key in mat) {
                                    inst[key] = mat[key];
                                }
                            }
                            if (!inst.emissiveMap) {
                                inst.emissiveMap = inst.map;
                            }
                            inst.file = file;
                            inst.loading = false;

                        }, this.reset);

                    // simple
                    } else {
                        assetman.loadTexture(path, function (tex) {
                            inst.file = file;
                            inst.map = tex;
                            inst.emissiveMap = tex;
                            inst.loading = false;

                        }, this.reset);
                    }

                } else {
                    this.reset();
                }
            }

            return false;
        }
    }
}