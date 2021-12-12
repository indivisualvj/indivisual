/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshTextureMaterialPlugin} from "../MeshTextureMaterialPlugin";
import {
    CubeReflectionMapping,
    LinearMipmapLinearFilter,
    Mesh,
    MeshPhysicalMaterial
} from "three";

class reflectivebackground extends MeshTextureMaterialPlugin {
    static name = 'reflective (cubetexture background)';
    static tutorial = {
        reflection: {
            text: 'use background_input to change reflection'
        }
    };

    apply(geometry, index) {

        let inst = this;
        let file = this.settings.background_input;
        this.material = new MeshPhysicalMaterial({envMap: null});
        let mesh = new Mesh(geometry, this.material);
        mesh.name = this.id(index);

        let _onLoad = (texture) => {
            texture.name = file;
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
            texture.mapping = CubeReflectionMapping;
            this.material.envMap = texture;
            this.material.needsUpdate = true;
        };

        this.cubeTextureFromBackgroundInput(_onLoad);
        let id = this.id(index);
        this.config.getEventManager().register(EVENT_ANIMATION_UPDATE_SETTING, id, function (data) {
            if (data.layer === inst.layer) {
                switch (data.item) {
                    case 'background_input':
                        if (data.value !== file) {
                            file = data.value;
                            inst.cubeTextureFromBackgroundInput(_onLoad);
                        }
                        break;
                }
            }
        });

        return mesh;
    }

    reset() {
        this.config.getEventManager().removeLike(this.id());
    }
}

export {reflectivebackground};
