/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshCameraMaterialPlugin} from "../MeshCameraMaterialPlugin";
import {Messaging} from "../../../../shared/Messaging";
import {CubeCamera, LinearMipmapLinearFilter, Mesh, MeshPhongMaterial, RGBFormat, WebGLCubeRenderTarget} from "three";

class reflective extends MeshCameraMaterialPlugin {

    static tutorial = {
        shiny_balls: {
            text: 'set shape_geometry to icosahedron and level of detail (shape_moda) to 3',
            action: function () {
                let data = {
                    shape: {
                        shape_geometry: 'icosahedron',
                        shape_moda: 3
                    }
                };
                this.animation.updateSettings(this.config.ControlSettings.layer, data, true, false, true);
                Messaging.emitSettings(this.config.ControlSettings.layer, data, true, true, true);
            }
        }
    };

    /**
     *
     * @param {BufferGeometry} geometry
     * @param index
     * @returns {Mesh}
     */
    apply(geometry, index) {

        geometry.computeBoundingBox();

        let box3 = geometry.boundingBox;
        let height = box3.max.y - box3.min.y;
        let cubeRenderTarget = new WebGLCubeRenderTarget(height, {
            format: RGBFormat,
            generateMipmaps: true,
            minFilter: LinearMipmapLinearFilter
        });
        let cubecam = new CubeCamera(1, 10000, cubeRenderTarget);

        this.cameras.add(cubecam);

        this.material = new MeshPhongMaterial({
            envMap: cubeRenderTarget.texture
        });
        let mesh = new Mesh(geometry, this.material);
        mesh.name = this.id(index);
        this.config.getEventManager().register(EVENT_RENDERER_BEFORE_RENDER, this.id(index), (renderer) => {
            if (this.layer.isVisible()) {
                mesh.visible = false;

                mesh.getWorldPosition(cubecam.position);
                cubecam.update(this.layer.three.renderer, this.layer.three.scene);

                mesh.visible = true;
            }
        });

        return mesh;
    }
}

export {reflective};
