/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.MeshTextureMaterialPlugin = class MeshTextureMaterialPlugin extends HC.MeshMaterialPlugin {

        static index = 90;

        cubeTextureFromBackgroundInput(callback) {
            this.loadCubeTexture(this.settings.background_input, callback);
        }

        loadCubeTexture(name, callback) {
            let path = HC.filePath(CUBE_DIR, name);
            this.config.getAssetManager().loadCubeTexture(path, function (texture) {
                callback(texture);
            });
        }
    }
}