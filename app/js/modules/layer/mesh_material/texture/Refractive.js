/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshTextureMaterialPlugin} from "../MeshTextureMaterialPlugin";

class refractivebackground extends MeshTextureMaterialPlugin {
    static name = 'refractive (cubetexture background)';
    static tutorial = {
        refraction: {
            text: 'use background_input to change refraction'
        },
        refraction_ratio: {
            text: 'use material_shininess to change the material\'s refraction ratio'
        }
    };

    apply(geometry, index) {

        let inst = this;
        let file = this.settings.background_input;
        this.material = new THREE.MeshPhongMaterial({envMap: null});
        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.name = this.id(index);

        let _onLoad = (texture) => {
            texture.name = file;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.mapping = THREE.CubeRefractionMapping;
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

export {refractivebackground};