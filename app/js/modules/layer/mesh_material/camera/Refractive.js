/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Messaging} from "../../../../shared/Messaging";
import {MeshCameraMaterialPlugin} from "../MeshCameraMaterialPlugin";

class refractive extends MeshCameraMaterialPlugin {

        static tutorial = {
            refraction_ratio: {
                text: 'use material_shininess to change the material\'s refraction ratio'
            },
            marbles: {
                text: 'set refraction ratio to 50, shape_geometry to icosahedron and level of detail (shape_moda) to 3',
                action: function () {
                    let data = {
                        shape: {
                            shape_geometry: 'icosahedron',
                            shape_moda: 3,
                        },
                        material: {
                            material_shininess: 50
                        }
                    };
                    this.animation.updateSettings(this.config.ControlSettings.layer, data, true, false, true);
                    Messaging.emitSettings(this.config.ControlSettings.layer, data, true, true, true);
                }
            }
        };

        apply(geometry, index) {

            geometry.computeBoundingBox();
            let box3 = geometry.boundingBox;
            let height = box3.max.y - box3.min.y;
            let cubeRenderTarget = new THREE.WebGLCubeRenderTarget( height, {
                format: THREE.RGBFormat,
                generateMipmaps: true,
                minFilter: THREE.LinearMipmapLinearFilter,
                mapping: THREE.CubeRefractionMapping,
            } );
            let cubecam = new THREE.CubeCamera(1, 10000, cubeRenderTarget);
            this.cameras.add(cubecam);

            this.material = new THREE.MeshPhongMaterial({envMap: cubeRenderTarget.texture});
            let mesh = new THREE.Mesh(geometry, this.material);
            mesh.name = this.id(index);

            let inst = this;
            this.config.getEventManager().register(EVENT_RENDERER_BEFORE_RENDER, this.id(index), function (renderer) {
                if (inst.layer.isVisible()) {
                    mesh.visible = false;

                    mesh.getWorldPosition(cubecam.position);
                    cubecam.update(inst.layer.three.renderer, inst.layer.three.scene);

                    mesh.visible = true;
                }
            });

            return mesh;
        }
    }

export {refractive};


