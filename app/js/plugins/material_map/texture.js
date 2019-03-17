{
    HC.plugins.material_map.texture = class Plugin extends HC.MaterialMapPlugin {

        texture;
        loading;

        apply(file) {

            file = assetman.getImage(file);

            if (this.texture && this.texture.name != file) {
                this.reset();
            }

            if (!this.loading && !this.texture) {
                if (file) {
                    let inst = this;
                    let path = filePath(IMAGE_DIR, file);
                    this.loading = true;
                    new THREE.TextureLoader().load(path, function (tex) {
                        tex.name = file;
                        inst.texture = tex;
                        inst.loading = false;
                    }, false, inst.reset);

                } else {
                    this.reset();
                }
            }

            return false;
        }
    }
}