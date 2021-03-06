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
            let path = filePath(CUBE_DIR, name);
            assetman.loadCubeTexture(path, function (texture) {
                callback(texture);
            });
        }
    }
}