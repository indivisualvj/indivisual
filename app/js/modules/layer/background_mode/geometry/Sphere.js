/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {GeometryBackgroundModePlugin} from "../GeometryBackgroundModePlugin";
import {Color, DoubleSide, Mesh, MeshPhysicalMaterial, SphereBufferGeometry} from "three";

class sphere extends GeometryBackgroundModePlugin {
        static index = 51;

        apply() {
            if (this.needsUpdate()) {
                this.current(this.id());

                let color = new Color(this.settings.background_color);
                let res = this.layer.resolution().clone();
                res.multiplyScalar(this.settings.background_volume);
                let geo = new SphereBufferGeometry(res.length() * 2, 16, 16);
                geo.rotateY(Math.PI / 2);
                this.geometry = geo;

                this.material = new MeshPhysicalMaterial({
                    color: color,
                    side: DoubleSide
                });

                let mesh = new Mesh(geo, this.material);
                mesh.receiveShadow = true;
                this.mesh = mesh;

                this.layer.setBackground(mesh);

                let file = this.config.getAssetManager().getImage(this.settings.background_input);
                if (file) {
                    this.config.getAssetManager().loadMaterialMap(this.material, filePath(IMAGE_DIR, file), function (mat) {
                        if (!mat.emissiveMap) {
                            mat.emissiveMap = mat.map;
                        }
                        mat.needsUpdate = true;
                    });
                }
            }
        }
    }

export {sphere};
