/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "./MeshMaterialPlugin";

class MeshTextureMaterialPlugin extends MeshMaterialPlugin {

    static index = 90;

    cubeTextureFromBackgroundInput(callback) {
        this.loadCubeTexture(this.settings.background_input, callback);
    }

    loadCubeTexture(name, callback) {
        let path = filePath(CUBE_DIR, name);
        this.config.getAssetManager().loadCubeTexture(path, function (texture) {
            callback(texture);
        });
    }
}

export {MeshTextureMaterialPlugin};
